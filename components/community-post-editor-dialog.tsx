"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { api, CommunityPostDetail, CommunityPostEditorMedia } from "@/lib/api"
import { buildEditableCommunityMedia, createEditableCommunityMediaFromFile, moveCommunityMediaItem } from "@/lib/community-post-edit"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Pencil, Trash2, X } from "lucide-react"

interface CommunityPostEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  postId?: string | null
  onSuccess?: (postId: string) => void
}

const isBlobUrl = (url?: string | null) => Boolean(url && url.startsWith("blob:"))

export function CommunityPostEditorDialog({
  open,
  onOpenChange,
  mode,
  postId,
  onSuccess,
}: CommunityPostEditorDialogProps) {
  const { toast } = useToast()

  const [isLoadingPost, setIsLoadingPost] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [removeCover, setRemoveCover] = useState(false)
  const [mediaItems, setMediaItems] = useState<CommunityPostEditorMedia[]>([])
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([])
  const [error, setError] = useState("")

  const coverInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)
  const replaceMediaInputRef = useRef<HTMLInputElement>(null)
  const replaceTargetClientIdRef = useRef<string | null>(null)
  const previousObjectUrlsRef = useRef<string[]>([])

  const dialogTitle = mode === "edit" ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"
  const dialogDescription =
    mode === "edit"
      ? "Cập nhật nội dung, ảnh bìa và bộ ảnh phụ của bài viết."
      : "Chia sẻ cảm nghĩ hoặc hình ảnh về di sản văn hóa cùng cộng đồng."

  const canSubmit = useMemo(() => {
    return Boolean(title.trim()) && Boolean(content.trim() || coverPreviewUrl || mediaItems.length > 0)
  }, [content, coverPreviewUrl, mediaItems.length, title])

  useEffect(() => {
    if (!open) {
      resetForm()
      return
    }

    if (mode === "edit" && postId) {
      void loadPost(postId)
      return
    }

    resetForm()
  }, [mode, open, postId])

  useEffect(() => {
    return () => {
      cleanupObjectUrls()
    }
  }, [])

  const cleanupObjectUrls = () => {
    previousObjectUrlsRef.current.forEach((url) => {
      if (isBlobUrl(url)) {
        URL.revokeObjectURL(url)
      }
    })
    previousObjectUrlsRef.current = []
  }

  const rememberObjectUrl = (url: string) => {
    if (isBlobUrl(url)) {
      previousObjectUrlsRef.current.push(url)
    }
  }

  const resetForm = () => {
    cleanupObjectUrls()
    setIsLoadingPost(false)
    setIsSubmitting(false)
    setTitle("")
    setContent("")
    setCoverPreviewUrl(null)
    setCoverFile(null)
    setRemoveCover(false)
    setMediaItems([])
    setDeletedMediaIds([])
    setError("")
    replaceTargetClientIdRef.current = null
  }

  const loadPost = async (id: string) => {
    setIsLoadingPost(true)
    setError("")
    cleanupObjectUrls()

    try {
      const post = await api.community.getPostById(id)
      setTitle(post.title ?? "")
      setContent(post.content ?? "")
      setCoverPreviewUrl(post.coverUrl ?? null)
      setCoverFile(null)
      setRemoveCover(false)
      setMediaItems(buildEditableCommunityMedia(post))
      setDeletedMediaIds([])
    } catch (error: any) {
      setError(error.message || "Không thể tải dữ liệu bài viết.")
    } finally {
      setIsLoadingPost(false)
    }
  }

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (coverPreviewUrl && isBlobUrl(coverPreviewUrl)) {
      URL.revokeObjectURL(coverPreviewUrl)
    }

    const nextUrl = URL.createObjectURL(file)
    rememberObjectUrl(nextUrl)
    setCoverFile(file)
    setCoverPreviewUrl(nextUrl)
    setRemoveCover(false)
    event.target.value = ""
  }

  const handleRemoveCover = () => {
    if (coverPreviewUrl && isBlobUrl(coverPreviewUrl)) {
      URL.revokeObjectURL(coverPreviewUrl)
    }
    setCoverPreviewUrl(null)
    setCoverFile(null)
    setRemoveCover(mode === "edit")
  }

  const handleMediaAdd = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    const nextItems = files.map((file) => {
      const item = createEditableCommunityMediaFromFile(file)
      rememberObjectUrl(item.previewUrl)
      return item
    })

    setMediaItems((prev) => [...prev, ...nextItems].slice(0, 8))
    event.target.value = ""
  }

  const handleReplaceMedia = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const targetClientId = replaceTargetClientIdRef.current
    event.target.value = ""
    replaceTargetClientIdRef.current = null
    if (!file || !targetClientId) return

    setMediaItems((prev) =>
      prev.map((item) => {
        if (item.clientId !== targetClientId) {
          return item
        }

        if (item.id && item.isExisting) {
          setDeletedMediaIds((current) => Array.from(new Set([...current, item.id!])))
        } else if (!item.isExisting && item.previewUrl && isBlobUrl(item.previewUrl)) {
          URL.revokeObjectURL(item.previewUrl)
        }

        const replacedItem = createEditableCommunityMediaFromFile(file)
        rememberObjectUrl(replacedItem.previewUrl)
        return {
          ...replacedItem,
          clientId: targetClientId,
          caption: item.caption,
        }
      }),
    )
  }

  const handleRemoveMedia = (clientId: string) => {
    setMediaItems((prev) =>
      prev.filter((item) => {
        if (item.clientId !== clientId) {
          return true
        }

        if (item.id && item.isExisting) {
          setDeletedMediaIds((current) => Array.from(new Set([...current, item.id!])))
        }

        if (!item.isExisting && isBlobUrl(item.previewUrl)) {
          URL.revokeObjectURL(item.previewUrl)
        }

        return false
      }),
    )
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết.")
      return
    }

    if (!content.trim() && !coverPreviewUrl && mediaItems.length === 0) {
      setError("Vui lòng giữ lại ít nhất một ảnh hoặc nội dung bài viết.")
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === "edit" && postId) {
        const existingMedia = mediaItems
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => item.isExisting && item.id)
          .map(({ item, index }) => ({
            id: item.id!,
            caption: item.caption,
            sortOrder: index,
          }))

        const newMedia = mediaItems
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => !item.isExisting && item.file)
          .map(({ item, index }) => ({
            file: item.file!,
            caption: item.caption,
            sortOrder: index,
          }))

        await api.community.updatePost(postId, {
          title: title.trim(),
          content: content.trim(),
          coverFile: coverFile ?? undefined,
          removeCover,
          existingMedia,
          deletedMediaIds,
          newMedia,
        })

        toast({
          title: "Đã cập nhật bài viết",
          description: "Các thay đổi của bạn đã được lưu.",
        })
        onOpenChange(false)
        onSuccess?.(postId)
        return
      }

      const createdPost = await api.community.createPost({
        title: title.trim(),
        content: content.trim() || undefined,
        coverFile: coverFile ?? undefined,
        mediaFiles: mediaItems.map((item) => item.file).filter(Boolean) as File[],
        captions: mediaItems.map((item) => item.caption ?? ""),
      })

      toast({
        title: "Đăng bài thành công",
        description: "Bài viết của bạn đã được đăng lên cộng đồng.",
      })
      onOpenChange(false)
      onSuccess?.(createdPost.id)
    } catch (error: any) {
      setError(error.message || "Không thể lưu bài viết.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {isLoadingPost ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Tiêu đề bài viết <span className="text-red-500">*</span>
              </label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="VD: Góc chia sẻ trải nghiệm di sản..."
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Nội dung</label>
              <Textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Bạn muốn chia sẻ điều gì?"
                rows={5}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">Ảnh bìa</label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    {coverPreviewUrl ? "Đổi ảnh bìa" : "Chọn ảnh bìa"}
                  </Button>
                  {coverPreviewUrl && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveCover}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
                {coverPreviewUrl ? (
                  <div className="relative aspect-video">
                    <img src={coverPreviewUrl} alt="Ảnh bìa" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center text-sm text-gray-500">
                    Chưa có ảnh bìa
                  </div>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCoverChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">Ảnh phụ</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={isSubmitting || mediaItems.length >= 8}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Thêm ảnh
                </Button>
              </div>

              {mediaItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                  Chưa có ảnh phụ nào.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {mediaItems.map((item, index) => (
                    <div key={item.clientId} className="overflow-hidden rounded-lg border bg-white shadow-sm">
                      <div className="relative aspect-square">
                        <img src={item.previewUrl} alt="Ảnh phụ" className="h-full w-full object-cover" />
                        <div className="absolute right-2 top-2 flex gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={() => {
                              replaceTargetClientIdRef.current = item.clientId
                              replaceMediaInputRef.current?.click()
                            }}
                            disabled={isSubmitting}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => handleRemoveMedia(item.clientId)}
                            disabled={isSubmitting}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t px-3 py-2">
                        <span className="text-xs text-gray-500">
                          {item.isExisting ? "Đang lưu" : "Ảnh mới"}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setMediaItems((prev) => moveCommunityMediaItem(prev, index, index - 1))}
                            disabled={isSubmitting || index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => setMediaItems((prev) => moveCommunityMediaItem(prev, index, index + 1))}
                            disabled={isSubmitting || index === mediaItems.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <input
                ref={mediaInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleMediaAdd}
                disabled={isSubmitting}
              />
              <input
                ref={replaceMediaInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleReplaceMedia}
                disabled={isSubmitting}
              />
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 border-t pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting || !canSubmit} className="bg-primary text-white hover:bg-primary/90">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "edit" ? "Lưu thay đổi" : "Đăng bài"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
