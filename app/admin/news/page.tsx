"use client"

import { useState, useEffect } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const res = await api.admin.news.getAll({ limit: 50 })
      setNews(res?.items || [])
    } catch (error: any) {
      toast.error(error.message || "Không thể tải danh sách tin tức")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return
    try {
      await api.admin.news.delete(id)
      toast.success("Đã xóa bài viết thành công")
      fetchNews()
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa bài viết")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Tin tức</h2>
          <p className="text-muted-foreground mt-2">
            Thêm mới, chỉnh sửa, hoặc xóa các bài viết tin tức.
          </p>
        </div>
        <Button onClick={() => router.push("/admin/news/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Bài viết mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
          <CardDescription>Tất cả bài viết được tạo trên hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày xuất bản</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 h-24">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : news.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Chưa có bài viết nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  news.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium max-w-[300px] truncate" title={item.title}>
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                          {item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.publishedAt ? format(new Date(item.publishedAt), 'dd/MM/yyyy HH:mm', { locale: vi }) : '---'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/admin/news/${item.id}`)}
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
