"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, FileText, CheckCircle, Loader2, Image as ImageIcon, Star, Trash2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { api, Contest } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
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
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  localId: string;
  file?: File; // Optional because existing files don't have a File object
  status: 'pending' | 'uploading' | 'completed' | 'error';
  mediaAssetId?: string;
  url?: string;
  type?: string;
  caption?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function ContestEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
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
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const submission = await api.contests.getSubmissionDetail(id);
        
        // Fill basic data
        setTitle(submission.title);
        setDescription(submission.description || "");
        setSelectedContestId(submission.contestId);
        setSelectedCategoryId(submission.categoryId);

        // Fetch categories for this contest
        const cats = await api.contests.getCategories(submission.contestId);
        setCategories(cats);

        // Map media
        const photos: UploadedFile[] = (submission.media || [])
          .filter((m: any) => m.type === 'IMAGE' || m.type === 'image')
          .map((m: any) => ({
            localId: m.id,
            status: 'completed',
            mediaAssetId: m.mediaAssetId,
            url: m.url,
            type: 'IMAGE',
            caption: m.caption // Store caption
          }));
        setPhotoFiles(photos);

        const pdf = (submission.media || []).find((m: any) => m.type === 'DOCUMENT' || m.type === 'PDF');
        if (pdf) {
          setPdfFile({
            localId: pdf.id,
            status: 'completed',
            mediaAssetId: pdf.mediaAssetId,
            url: pdf.url,
            type: 'DOCUMENT',
            caption: pdf.caption,
            file: { name: pdf.caption || "Document.pdf" } as any
          });
        }

      } catch (err) {
        console.error("Failed to fetch submission details", err);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin bài thi",
          variant: "destructive"
        });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmissionData();
    }
  }, [id, router, toast]);

  const removePhotoFile = (localId: string) => {
    setPhotoFiles(photoFiles.filter((f) => f.localId !== localId));
  };

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const newFiles = [...photoFiles];
    const item = newFiles.splice(index, 1)[0];
    newFiles.unshift(item);
    setPhotoFiles(newFiles);
  };

  const uploadFile = async (fileWrapper: UploadedFile & { caption?: string }) => {
    if (!fileWrapper.file) return;
    
    try {
      setPhotoFiles(prev => prev.map(f => f.localId === fileWrapper.localId ? { ...f, status: 'uploading' } : f));
      const response = await api.media.upload(fileWrapper.file);
      setPhotoFiles(prev => prev.map(f => f.localId === fileWrapper.localId ? {
        ...f,
        status: 'completed',
        mediaAssetId: response.id,
        url: response.mediaUrl,
        type: response.mediaType,
        caption: fileWrapper.file?.name // Set initial caption
      } : f));
    } catch (err) {
      setPhotoFiles(prev => prev.map(f => f.localId === fileWrapper.localId ? { ...f, status: 'error' } : f));
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
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
    const localFile: UploadedFile = {
      localId: `pdf-${Date.now()}`,
      file,
      status: 'pending',
      url: URL.createObjectURL(file)
    };
    setPdfFile(localFile);
    try {
      setPdfFile(prev => prev ? { ...prev, status: 'uploading' } : null);
      const response = await api.media.upload(file);
      setPdfFile(prev => prev ? {
        ...prev,
        status: 'completed',
        mediaAssetId: response.id,
        url: response.mediaUrl,
        type: response.mediaType,
        caption: file.name
      } : null);
    } catch (err) {
      setPdfFile(prev => prev ? { ...prev, status: 'error' } : null);
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      setErrorDialog({ open: true, message: "Vui lòng nhập tiêu đề tác phẩm" });
      return;
    }
    if (!selectedCategoryId) {
      setErrorDialog({ open: true, message: "Vui lòng chọn hạng mục tham gia" });
      return;
    }
    if (photoFiles.length === 0) {
      setErrorDialog({ open: true, message: "Vui lòng tải lên ít nhất một ảnh minh họa" });
      return;
    }

    const pending = photoFiles.find(f => f.status === 'uploading' || f.status === 'pending');
    const pdfPending = pdfFile && (pdfFile.status === 'uploading' || pdfFile.status === 'pending');
    if (pending || pdfPending) {
      setErrorDialog({ open: true, message: "Vui lòng đợi quá trình tải lên hoàn tất" });
      return;
    }

    const invalidMedia = photoFiles.find(f => !f.mediaAssetId);
    if (invalidMedia) {
       setErrorDialog({ open: true, message: "Một số ảnh chưa được tải lên máy chủ đúng cách. Vui lòng thử xóa và tải lại." });
       return;
    }

    setIsSubmitting(true);
    try {
      const mediaList = photoFiles.map((f, index) => ({
        mediaAssetId: f.mediaAssetId,
        type: 'IMAGE',
        caption: (f as any).caption || f.file?.name || "Image",
        sortOrder: index
      }));

      if (pdfFile && pdfFile.mediaAssetId) {
        mediaList.push({
          mediaAssetId: pdfFile.mediaAssetId,
          type: 'DOCUMENT',
          caption: (pdfFile as any).caption || pdfFile.file?.name || "Document.pdf",
          sortOrder: mediaList.length
        });
      }

      await api.contests.updateSubmission(id, {
        contestId: selectedContestId,
        categoryId: selectedCategoryId,
        title,
        description,
        media: mediaList
      });
      
      setShowSuccessDialog(true);
    } catch (err: any) {
      setErrorDialog({ open: true, message: err.message || "Cập nhật thất bại" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2 text-gray-500">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('from') === 'admin' 
              ? "Admin: Chỉnh sửa bài dự thi" 
              : "Chỉnh sửa bài dự thi"}
          </h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tiêu đề tác phẩm <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Hạng mục <span className="text-red-500">*</span></label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
               <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn hạng mục..." />
               </SelectTrigger>
               <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                       {cat.name}
                    </SelectItem>
                  ))}
               </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mô tả ý tưởng</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none text-gray-900"
            />
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Ảnh minh họa <span className="text-red-500">*</span></label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer"
            >
              <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" />
              <Upload className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Nhấn để tải thêm ảnh</p>
            </div>

            {photoFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photoFiles.map((file, index) => (
                  <div key={file.localId} className="relative group rounded-lg overflow-hidden border aspect-square">
                    <img src={file.url} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <button onClick={() => setAsMain(index)} className="p-1.5 bg-white rounded-full"><Star size={16} /></button>
                        <button onClick={() => removePhotoFile(file.localId)} className="p-1.5 bg-white text-red-600 rounded-full"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    {file.status === 'uploading' && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PDF Section */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700">Tài liệu đính kèm (PDF)</label>
            <div className="flex items-center gap-4">
              <input ref={pdfInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
              <Button variant="outline" onClick={() => pdfInputRef.current?.click()}>
                <FileText className="w-4 h-4 mr-2" />
                {pdfFile ? "Thay đổi PDF" : "Tải lên PDF"}
              </Button>
              {pdfFile && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border">
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{pdfFile.file?.name || "Document.pdf"}</span>
                  <button onClick={() => setPdfFile(null)} className="p-1 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <Button variant="outline" onClick={() => router.back()}>Hủy bỏ</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-white">
            {isSubmitting && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Cập nhật thành công!</DialogTitle>
            <DialogDescription className="text-center">
              {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('from') === 'admin'
                ? "Dữ liệu bài dự thi đã được cập nhật thành công."
                : "Bài dự thi của bạn đã được cập nhật và đang chờ Ban tổ chức phê duyệt lại."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={() => {
                const searchParams = new URLSearchParams(window.location.search);
                const from = searchParams.get('from');
                const contestId = searchParams.get('contestId');
                
                if (from === 'admin' && contestId) {
                  router.push(`/admin/submissions?contestId=${contestId}`);
                } else if (from === 'admin') {
                  router.push(`/admin/contests`);
                } else {
                  router.push("/dashboard/submissions");
                }
              }} 
              className="bg-primary text-white w-full sm:w-auto"
            >
              {new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('from') === 'admin'
                ? "Về trang quản trị"
                : "Về danh sách bài thi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
