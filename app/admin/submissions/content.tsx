"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Check, X, Eye, RefreshCw, Edit3 } from "lucide-react"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function AdminSubmissionsContent() {
    const searchParams = useSearchParams()
    const contestId = searchParams.get("contestId")

    const [submissions, setSubmissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("pending")
    const { toast } = useToast()
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // Reject Dialog State
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
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
        if (!contestId) return

        const fetchSubmissions = async () => {
            setLoading(true)
            try {
                const response = await api.admin.submissions.getAll({
                    contestId,
                    status: statusFilter === "all" ? undefined : statusFilter,
                    page: 1,
                    limit: 50
                })
                setSubmissions(response.items || [])
            } catch (error) {
                console.error(error)
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách bài thi",
                    variant: "destructive"
                })
            } finally {
                setLoading(false)
            }
        }

        fetchSubmissions()
    }, [contestId, statusFilter, refreshTrigger, toast])

    const router = useRouter()

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1)
        toast({
            title: "Đang làm mới",
            description: "Đang tải lại danh sách bài thi...",
        })
    }

    const handleStatusUpdate = async (id: string, status: string, reason?: string) => {
        // Optimistic update
        const previousSubmissions = [...submissions]
        
        if (statusFilter !== 'all' && statusFilter !== status) {
            setSubmissions(prev => prev.filter(sub => sub.id !== id))
        } else {
             setSubmissions(prev => prev.map(sub =>
                sub.id === id ? { ...sub, status: status } : sub
            ))
        }

        try {
            await api.admin.submissions.updateStatus(id, status, reason)
            toast({
                title: "Thành công",
                description: `Đã cập nhật trạng thái bài thi`
            })

            setRefreshTrigger(prev => prev + 1)
            router.refresh()

            setRejectDialogOpen(false)
            setRejectReason("")
            setSelectedSubmissionId(null)
        } catch (error) {
            setSubmissions(previousSubmissions)
            toast({
                title: "Lỗi",
                description: "Cập nhật trạng thái thất bại",
                variant: "destructive"
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

    if (!contestId) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-xl font-semibold">Vui lòng chọn một cuộc thi để xem danh sách bài thi</h2>
                <Button asChild>
                    <Link href="/admin/contests">Đến trang Cuộc thi</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý bài thi</h1>
                    <p className="text-muted-foreground">Xem xét và phê duyệt các bài dự thi</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleRefresh}
                        disabled={loading}
                        title="Làm mới dữ liệu"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <div className="w-[200px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Chờ duyệt</SelectItem>
                                <SelectItem value="approved">Đã duyệt</SelectItem>
                                <SelectItem value="rejected">Đã từ chối</SelectItem>
                                <SelectItem value="hidden">Đang ẩn</SelectItem>
                                <SelectItem value="all">Tất cả</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Tác giả</TableHead>
                            <TableHead className="hidden">Hạng mục</TableHead>
                            <TableHead>Báo cáo</TableHead>
                            <TableHead>Ngày nộp</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    Không có bài thi nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className="font-medium">{submission.title}</TableCell>
                                    <TableCell>{submission.author?.name}</TableCell>
                                    <TableCell className="hidden">{submission.categoryName}</TableCell>
                                    <TableCell>
                                        {submission.reportCount > 0 ? (
                                            <Badge variant="destructive" className="animate-pulse">
                                                {submission.reportCount}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">0</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(submission.createdAt).toLocaleDateString("vi-VN")}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            submission.status === 'approved' ? 'default' :
                                                submission.status === 'rejected' ? 'destructive' : 
                                                submission.status === 'hidden' ? 'outline' : 'secondary'
                                        }>
                                            {submission.status === 'approved' ? 'Đã duyệt' : 
                                             submission.status === 'rejected' ? 'Từ chối' : 
                                             submission.status === 'hidden' ? 'Đang ẩn' : 'Chờ duyệt'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" asChild title="Xem bài thi">
                                            <Link href={`/admin/submissions/${submission.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        <Button variant="ghost" size="icon" asChild title="Sửa bài thi" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                            <Link href={`/contests/edit/${submission.id}?from=admin&contestId=${contestId}`}>
                                                <Edit3 className="h-4 w-4" />
                                            </Link>
                                        </Button>

                                        {(submission.status === 'pending' || submission.status === 'hidden') && (
                                            <>
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleStatusUpdate(submission.id, 'approved')}
                                                >
                                                    <Check className="h-4 w-4 mr-1" /> Duyệt
                                                </Button>

                                                <Dialog open={rejectDialogOpen && selectedSubmissionId === submission.id} onOpenChange={(open) => {
                                                    setRejectDialogOpen(open)
                                                    if (open) setSelectedSubmissionId(submission.id)
                                                    else {
                                                        setSelectedSubmissionId(null)
                                                        setRejectReason("")
                                                    }
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="destructive">
                                                            <X className="h-4 w-4 mr-1" /> Từ chối
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Từ chối bài thi</DialogTitle>
                                                            <DialogDescription>
                                                                Vui lòng chọn lý do từ chối bài dự thi này.
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
                                                                onClick={() => handleStatusUpdate(submission.id, 'rejected', rejectReason)}
                                                                disabled={!rejectReason.trim()}
                                                            >
                                                                Xác nhận từ chối
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
