"use client"

import { useEffect, useState, use } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NewsEditor } from "@/components/news-editor"
import { ImagePlus, Loader2 } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default function EditNewsPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    status: "draft"
  })

  useEffect(() => {
    const load = async () => {
      try {
        const item = await api.admin.news.getById(id)
        if (item) {
          setFormData({
            title: item.title || "",
            summary: item.summary || "",
            content: item.content || "",
            status: item.status || "draft",
          })
          if (item.coverImage) {
            setCoverPreview(item.coverImage)
          }
        } else {
          toast.error("Không tìm thấy bài viết")
          router.push("/admin/news")
        }
      } catch (e: any) {
        toast.error(e.message || "Không thể tải bài viết")
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung")
      return
    }

    try {
      setLoading(true)
      await api.admin.news.update(id, {
        ...formData,
        tags: []
      })

      if (coverFile) {
        await api.admin.news.updateImage(id, coverFile)
      }

      toast.success("Cập nhật bài viết thành công!")
      router.push("/admin/news")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Đã xảy ra lỗi khi lưu bài viết")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Đang tải bài viết...</span>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chỉnh sửa bài viết</h2>
          <p className="text-muted-foreground mt-2">Cập nhật nội dung và thông tin bài báo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="min-w-[140px]">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {!loading ? "Lưu thay đổi" : "Đang lưu..."}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài viết</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Nội dung chi tiết</Label>
                <NewsEditor
                  content={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Trạng thái hiển thị</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Lưu nháp</SelectItem>
                    <SelectItem value="published">Xuất bản</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Tóm tắt (Summary)</Label>
                <Textarea
                  id="summary"
                  placeholder="Viết 1-2 câu tóm tắt nội dung..."
                  className="resize-none h-24"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Ảnh bìa (Cover Image)</Label>
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-muted/50 transition relative overflow-hidden h-40"
                  onClick={() => document.getElementById("cover-upload")?.click()}
                >
                  {coverPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverPreview} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm font-medium">Nhấp để đổi ảnh bìa</span>
                      <span className="text-xs text-muted-foreground mt-1">PNG, JPG or WEBP (max. 10MB)</span>
                    </>
                  )}
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {coverPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-destructive hover:text-destructive"
                    onClick={() => { setCoverFile(null); setCoverPreview("") }}
                  >
                    Xóa ảnh bìa
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
