"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, FileText, CheckCircle, Loader2, Image as ImageIcon, Star, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, Contest } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { compressImage } from "@/lib/image-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadedFile {
  localId: string;
  file: File;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  mediaAssetId?: string;
  url?: string;
  type?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function ContestSubmitPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoFiles, setPhotoFiles] = useState<UploadedFile[]>([]);
  const [pdfFile, setPdfFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Dialog States
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await api.contests.getAll({ limit: 100 });
        if (res.items && res.items.length > 0) {
          setContests(res.items);
          setSelectedContestId(res.items[0].id);
        } else if (Array.isArray(res)) {
          setContests(res);
          if (res.length > 0) setSelectedContestId(res[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch contests", err);
      }
    };
    fetchContests();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedContestId) {
        setCategories([]);
        return;
      }
      try {
        const cats = await api.contests.getCategories(selectedContestId);
        setCategories(cats);
        if (cats.length > 0) {
          setSelectedCategoryId(cats[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [selectedContestId]);

  const removePhotoFile = async (localId: string) => {
    const fileToRemove = photoFiles.find(f => f.localId === localId);
    if (fileToRemove?.mediaAssetId) {
      try {
        await api.media.delete(fileToRemove.mediaAssetId);
      } catch (err) {
        console.error("Failed to delete media asset from server", err);
      }
    }
    setPhotoFiles(photoFiles.filter((f) => f.localId !== localId));
  };

  const handleCancel = async () => {
    // Cleanup all uploaded files before leaving
    const filesToDelete = [...photoFiles];
    if (pdfFile) filesToDelete.push(pdfFile);

    for (const f of filesToDelete) {
      if (f.mediaAssetId) {
        try {
          await api.media.delete(f.mediaAssetId);
        } catch (err) { /* ignore */ }
      }
    }
    router.push("/contests");
  };

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const newFiles = [...photoFiles];
    const item = newFiles.splice(index, 1)[0];
    newFiles.unshift(item);
    setPhotoFiles(newFiles);
  };

  const uploadFile = async (fileWrapper: UploadedFile) => {
    try {
      setPhotoFiles(prev => prev.map(f => f.localId === fileWrapper.localId ? { ...f, status: 'uploading' } : f));

      // 1. Get Presigned URL
      const { uploadUrl, mediaUrl, mediaType } = await api.media.getPresignedUrl(
        fileWrapper.file.name,
        fileWrapper.file.type,
        'submissions'
      );

      // 2. Upload directly to Cloudflare R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileWrapper.file.type,
        },
        body: fileWrapper.file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload to R2 failed: ${uploadResponse.statusText}`);
      }

      // 3. Save metadata to backend
      const metadataResponse = await api.media.saveMetadata({
        mediaUrl,
        mediaType,
        fileName: fileWrapper.file.name,
        fileSize: fileWrapper.file.size,
        context: 'submissions'
      });

      setPhotoFiles(prev => prev.map(f => f.localId === fileWrapper.localId ? {
        ...f,
        status: 'completed',
        mediaAssetId: metadataResponse.id,
        url: mediaUrl,
        type: mediaType
      } : f));

    } catch (err) {
      console.error("Upload failed", err);
      setPhotoFiles(prev => prev.map(f => f.localId === fileWrapper.localId ? { ...f, status: 'error' } : f));
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const maxImageSize = 100 * 1024 * 1024; // 100MB
    const validFiles: File[] = [];
    const oversizedFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (file.size > maxImageSize) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      setErrorDialog({
        open: true,
        message: `Các file sau vượt quá giới hạn 100MB: ${oversizedFiles.join(", ")}`
      });
      if (validFiles.length === 0) return;
    }

    const newFiles: UploadedFile[] = validFiles.map((file, index) => ({
      localId: `${Date.now()}-${index}`,
      file,
      status: 'pending',
      url: URL.createObjectURL(file)
    }));

    setPhotoFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach(f => uploadFile(f));
  }, []);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorDialog({ open: true, message: "Vui lòng chỉ tải lên file PDF" });
      return;
    }

    if (file.size > 200 * 1024 * 1024) { // 200MB
      setErrorDialog({ open: true, message: "File PDF không được vượt quá 200MB" });
      return;
    }

    const localFile: UploadedFile = {
      localId: `pdf-${Date.now()}`,
      file,
      status: 'pending',
      url: URL.createObjectURL(file)
    };

    setPdfFile(localFile);

    try {
      setPdfFile(prev => prev ? { ...prev, status: 'uploading' } : null);
      
      // 1. Get Presigned URL
      const { uploadUrl, mediaUrl, mediaType } = await api.media.getPresignedUrl(
        file.name,
        file.type,
        'submissions'
      );

      // 2. Upload directly to Cloudflare R2
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`PDF upload to R2 failed: ${uploadResponse.statusText}`);
      }

      // 3. Save metadata to backend
      const metadataResponse = await api.media.saveMetadata({
        mediaUrl,
        mediaType,
        fileName: file.name,
        fileSize: file.size,
        context: 'submissions'
      });

      setPdfFile(prev => prev ? {
        ...prev,
        status: 'completed',
        mediaAssetId: metadataResponse.id,
        url: mediaUrl,
        type: mediaType
      } : null);
    } catch (err) {
      console.error("PDF upload failed", err);
      setPdfFile(prev => prev ? { ...prev, status: 'error' } : null);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const submitData = async () => {
    const mediaList = photoFiles.map((f, index) => ({
      mediaAssetId: f.mediaAssetId,
      type: 'IMAGE', // explicitly mark images
      caption: f.file.name,
      sortOrder: index
    }));

    // Add PDF to media list if exists
    if (pdfFile && pdfFile.mediaAssetId) {
      mediaList.push({
        mediaAssetId: pdfFile.mediaAssetId,
        type: 'DOCUMENT', // Mark as document for admin only access
        caption: pdfFile.file.name,
        sortOrder: mediaList.length
      });
    }

    await api.contests.uploadSubmission({
      contestId: selectedContestId,
      categoryId: selectedCategoryId,
      title,
      description,
      media: mediaList
    });
  };

  const handleSubmit = async () => {
    if (!selectedContestId || !selectedCategoryId || !title) {
      setErrorDialog({ open: true, message: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    if (photoFiles.length === 0) {
      setErrorDialog({ open: true, message: "Vui lòng tải lên ít nhất một tác phẩm" });
      return;
    }

    // Check if image upload is pending
    const pending = photoFiles.find(f => f.status === 'uploading' || f.status === 'pending');
    // Check if PDF upload is pending
    const pdfPending = pdfFile && (pdfFile.status === 'uploading' || pdfFile.status === 'pending');

    if (pending || pdfPending) {
      setErrorDialog({ open: true, message: "Vui lòng đợi quá trình tải lên hoàn tất" });
      return;
    }

    const failed = photoFiles.find(f => f.status === 'error');
    if (failed || (pdfFile && pdfFile.status === 'error')) {
      setErrorDialog({ open: true, message: "Một số file tải lên bị lỗi, vui lòng xóa và thử lại" });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitData();
      setShowSuccessDialog(true);
    } catch (err: any) {
      console.error("Submission failed", err);

      // Handle "must sign up" error by auto-signing up and retrying
      if (err.message && (err.message.includes("must sign up") || err.message.includes("not approved yet"))) {
        try {
          // Check current status first to avoid redundant signup calls
          let signupStatus;
          try {
            signupStatus = await api.contests.getSignupStatus(selectedContestId);
          } catch (e) { /* ignore */ }

          if (signupStatus?.isSignedUp && signupStatus?.status === 'pending') {
            setShowPendingDialog(true);
            setIsSubmitting(false);
            return;
          }

          // Attempt signup
          const signupRes = await api.contests.signup(selectedContestId);

          if (signupRes.status === 'approved') {
            // Retry submission immediately
            await submitData();
            setShowSuccessDialog(true);
          } else if (signupRes.status === 'pending') {
            setShowPendingDialog(true);
          }
        } catch (signupErr: any) {
          // Check if already pending
          if (signupErr.message && signupErr.message.includes("pending")) {
            setShowPendingDialog(true);
          } else {
            setErrorDialog({ open: true, message: "Lỗi đăng ký tham gia: " + signupErr.message });
          }
        }
      } else {
        setErrorDialog({ open: true, message: err.message || "Nộp bài thất bại" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    router.push("/contests");
  };

  const handleClosePending = () => {
    setShowPendingDialog(false);
    router.push("/contests");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-xl mb-4 text-gray-800">Vui lòng đăng nhập để tham gia cuộc thi</h1>
        <Link href="/login"><Button>Đăng nhập ngay</Button></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Nộp bài dự thi</h1>
        </div>

        <div className="space-y-6">
          {/* Contest Selection */}
          <div className="hidden">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Cuộc thi <span className="text-red-500">*</span>
              </label>
              <Select value={selectedContestId} onValueChange={setSelectedContestId}>
                <SelectTrigger className="w-full text-gray-900 bg-white border-gray-300">
                  <SelectValue placeholder="Chọn cuộc thi" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {contests.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-gray-900 focus:bg-primary-50 focus:text-primary-900 cursor-pointer">
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Hạng mục <span className="text-red-500">*</span>
              </label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="w-full text-gray-900 bg-white border-gray-300">
                  <SelectValue placeholder="Chọn hạng mục" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900">
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-gray-900 focus:bg-primary-50 focus:text-primary-900 cursor-pointer">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tiêu đề tác phẩm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề tác phẩm..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mô tả ý tưởng
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ý tưởng, thông điệp của tác phẩm..."
              maxLength={1400}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="text-right text-xs text-gray-500">
              {description.length}/1400 ký tự
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>Tác phẩm dự thi <span className="text-red-500">*</span></span>
            </label>

            <div className="space-y-4">
              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
                className={`w-full h-32 rounded-xl flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-all ${isDragging
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-500 hover:bg-gray-50"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Kéo thả ảnh vào đây hoặc <span className="text-primary-600">tải lên từ máy</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Hỗ trợ: JPG, PNG, WEBP (Tối đa 100MB/ảnh)</p>
              </div>

              {/* Preview Grid */}
              {photoFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photoFiles.map((file, index) => (
                    <div key={file.localId} className={`relative group rounded-lg overflow-hidden border ${index === 0 ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-gray-200'} bg-white aspect-square`}>
                      {/* Image Preview */}
                      {file.url ? (
                        <img
                          src={file.url}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Main Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10 flex items-center gap-1">
                          <Star size={10} fill="currentColor" /> Ảnh chính
                        </div>
                      )}

                      {/* Status Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setAsMain(index); }}
                            className="p-1.5 bg-white text-gray-700 rounded-full hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Đặt làm ảnh chính"
                          >
                            <Star size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removePhotoFile(file.localId); }}
                            className="p-1.5 bg-white text-gray-700 rounded-full hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa ảnh"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Loading/Error Overlay */}
                      {file.status !== 'completed' && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                          {file.status === 'uploading' && <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />}
                          {file.status === 'error' && <span className="text-red-500 text-xs font-medium">Lỗi tải lên</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
              <span>Tác phẩm dự thi(PDF)</span>
              <span className="text-xs text-gray-500 font-normal">Chỉ dành cho Ban tổ chức xem xét</span>
            </label>

            <div className="flex items-center gap-4">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => pdfInputRef.current?.click()}
                className="flex items-center gap-2 border-dashed border-2 h-12 px-6"
              >
                <FileText className="w-4 h-4" />
                {pdfFile ? "Thay đổi file PDF" : "Tải lên file PDF"}
              </Button>

              {pdfFile && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {pdfFile.file.name}
                  </span>
                  {pdfFile.status === 'uploading' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : pdfFile.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : pdfFile.status === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : null}
                  <button
                    onClick={() => setPdfFile(null)}
                    className="p-1 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">Tối đa 1 file PDF (Hỗ trợ: .pdf, tối đa 200MB)</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
            Gửi bài dự thi
          </button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Nộp bài thành công!</DialogTitle>
            <DialogDescription className="text-center">
              Bài dự thi của bạn đã được gửi thành công. Ban tổ chức sẽ xem xét và phê duyệt trong thời gian sớm nhất.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleCloseSuccess} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              Về danh sách cuộc thi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pending Signup Dialog */}
      <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <DialogTitle className="text-center text-xl">Đăng ký đang chờ phê duyệt</DialogTitle>
            <DialogDescription className="text-center">
              Bạn đã đăng ký tham gia cuộc thi này nhưng cần chờ Ban tổ chức phê duyệt trước khi có thể nộp bài.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleClosePending} className="bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto text-white">
              Đã hiểu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Lỗi
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-700 font-medium">
              {errorDialog.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setErrorDialog({ open: false, message: "" })} variant="secondary">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
