"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Check, X, Calendar, User, Tag, Eye, AlertTriangle, FileText, Edit3 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminSubmissionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { toast } = useToast()

  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Reject Dialog State
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const REJECTION_TEMPLATES = [
    "Nội dung không phù hợp với thuần phong mỹ tục",
    "Chất lượng hình ảnh/video quá thấp",
    "Sai chủ đề cuộc thi",
    "Vi phạm bản quyền",
    "Thông tin đăng ký không chính xác",
    "Khác"
  ]

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        // We can reuse the public API or admin API if exists for single submission
        // Ideally admin API to see unapproved ones.
        // Based on workflow, GET /api/v1/submissions/{id} is optional auth, so it should work.
        const response = await api.contests.getSubmissionDetail(id) // We need to add this to api.ts if missing
        setSubmission(response)
      } catch (error) {
        console.error("Failed to fetch submission:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải chi tiết bài thi",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSubmission()
    }
  }, [id, toast])

  const handleStatusUpdate = async (status: string, reason?: string) => {
    try {
      await api.admin.submissions.updateStatus(id, status, reason)
      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái bài thi`,
      })
      // Navigate back to the list
      // We try to go back first, if history is empty (direct link), we fallback to list
      // Since router.back() is void, we can't detect easily, so safer to push to list with contestId if available
      if (submission?.contestId) {
         router.push(`/admin/submissions?contestId=${submission.contestId}`)
      } else {
         router.back() 
      }
      
      setRejectDialogOpen(false)
      setRejectReason("")
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Cập nhật trạng thái thất bại",
        variant: "destructive",
      })
    }
  }

  const handleTemplateChange = (value: string) => {
    if (value !== "Khác") {
        setRejectReason(value)
    } else {
        setRejectReason("")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <h2 className="text-xl font-semibold">Không tìm thấy bài thi</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chi tiết bài thi</h1>
            <p className="text-muted-foreground text-sm">Xem lại nội dung trước khi phê duyệt</p>
          </div>
        </div>
        <Button variant="outline" asChild className="text-blue-600 border-blue-200 hover:bg-blue-50">
          <Link href={`/contests/edit/${id}?from=admin&contestId=${submission.contestId}`}>
            <Edit3 className="mr-2 h-4 w-4" /> Chỉnh sửa nội dung
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{submission.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Media Gallery */}
               <div className="space-y-4">
                  {submission.media && submission.media.length > 0 ? (
                    submission.media.map((media: any) => (
                      <div key={media.id} className="rounded-lg overflow-hidden border bg-muted/50">
                        {(media.type === 'image' || media.type === 'IMAGE' || media.type?.startsWith('image/')) ? (
                          <div className="relative aspect-video">
                            <Image 
                              src={media.url} 
                              alt={media.caption || submission.title} 
                              fill 
                              className="object-contain"
                            />
                          </div>
                        ) : (media.type === 'DOCUMENT' || media.type === 'PDF' || media.url?.toLowerCase().endsWith('.pdf')) ? (
                          <div className="p-12 flex flex-col items-center justify-center gap-4 bg-primary/5">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center">
                               <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div className="text-center">
                               <p className="font-bold text-gray-900">Tài liệu đính kèm (PDF)</p>
                               <p className="text-xs text-muted-foreground mt-1">{media.caption || "Hồ sơ năng lực"}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              className="border-primary text-primary hover:bg-primary hover:text-white"
                              onClick={() => window.open(media.url, '_blank')}
                            >
                               <Eye className="w-4 h-4 mr-2" /> Xem tài liệu PDF
                            </Button>
                          </div>
                        ) : (
                          <div className="p-10 text-center text-muted-foreground">
                            Loại tệp không hỗ trợ hiển thị: {media.type}
                          </div>
                        )}
                        {media.caption && (
                          <div className="p-3 text-sm text-muted-foreground bg-background border-t">
                            {media.caption}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center border rounded-lg bg-muted/20 text-muted-foreground">
                      Không có tệp đính kèm
                    </div>
                  )}
               </div>

               <div className="prose dark:prose-invert max-w-none mt-6">
                 <h3 className="font-semibold text-lg mb-2">Mô tả</h3>
                 <p className="whitespace-pre-wrap text-muted-foreground">
                   {submission.description || "Không có mô tả"}
                 </p>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Thông tin</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-sm font-medium">Trạng thái</span>
                   <Badge variant={
                      submission.status === 'approved' ? 'default' :
                      submission.status === 'rejected' ? 'destructive' : 
                      submission.status === 'hidden' ? 'outline' : 'secondary'
                   }>
                      {submission.status === 'approved' ? 'Đã duyệt' : 
                       submission.status === 'rejected' ? 'Từ chối' : 
                       submission.status === 'hidden' ? 'Đang ẩn' : 'Chờ duyệt'}
                   </Badge>
                </div>

                <div className="pt-4 border-t space-y-3">
                   {submission.reportCount > 0 && (
                      <div className="flex items-center gap-3 text-sm text-red-500 font-bold bg-red-500/10 p-2 rounded">
                         <AlertTriangle className="h-4 w-4" />
                         <span>Bị báo cáo: {submission.reportCount} lần</span>
                      </div>
                   )}
                   <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{submission.author?.name || "Tác giả ẩn danh"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{submission.categoryName}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(submission.createdAt).toLocaleDateString("vi-VN")}</span>
                   </div>
                </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="text-sm font-medium uppercase text-muted-foreground">Hành động</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               {submission.status === 'pending' && (
                 <>
                   <Button 
                     className="w-full bg-green-600 hover:bg-green-700" 
                     onClick={() => handleStatusUpdate('approved')}
                   >
                     <Check className="mr-2 h-4 w-4" /> Phê duyệt
                   </Button>

                   <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                      <DialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                             <X className="mr-2 h-4 w-4" /> Từ chối
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Từ chối bài thi</DialogTitle>
                              <DialogDescription>
                                  Vui lòng chọn lý do từ chối để gửi thông báo cho người dùng.
                              </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Lý do mẫu</label>
                                  <Select onValueChange={handleTemplateChange}>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Chọn lý do..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                          {REJECTION_TEMPLATES.map((reason) => (
                                              <SelectItem key={reason} value={reason}>
                                                  {reason}
                                              </SelectItem>
                                          ))}
                                      </SelectContent>
                                  </Select>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium">Chi tiết lý do</label>
                                  <Textarea
                                      placeholder="Nhập lý do cụ thể..."
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                  />
                              </div>
                          </div>
                          <DialogFooter>
                              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Hủy</Button>
                              <Button
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate('rejected', rejectReason)}
                                  disabled={!rejectReason.trim()}
                              >
                                  Xác nhận từ chối
                              </Button>
                          </DialogFooter>
                      </DialogContent>
                   </Dialog>
                 </>
               )}

               {submission.status === 'approved' && (
                  <Button 
                    variant="outline" 
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white" 
                    onClick={() => handleStatusUpdate('hidden')}
                  >
                    <Eye className="mr-2 h-4 w-4" /> Ẩn bài thi (Báo cáo)
                  </Button>
               )}

               {submission.status === 'hidden' && (
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      onClick={() => handleStatusUpdate('approved')}
                    >
                      <Check className="mr-2 h-4 w-4" /> Bỏ ẩn (Phục hồi)
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full" 
                      onClick={() => setRejectDialogOpen(true)}
                    >
                      <X className="mr-2 h-4 w-4" /> Hủy bài dự thi
                    </Button>
                  </div>
               )}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
