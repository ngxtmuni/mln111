"use client"

import React, { useEffect, useMemo, useState } from "react"
import { api, CommunityPostDetail, CommunityComment } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Send,
  Share2,
  Trash2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface CommunityPostDialogProps {
  postId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostChanged?: (postId: string) => void
  onPostDeleted?: (postId: string) => void
  onReactionChange?: (
    postId: string,
    updates: Partial<Pick<CommunityPostDetail, "hasLiked" | "hasSaved" | "totalLikes" | "totalComments">>,
  ) => void
  onRequestEdit?: (postId: string) => void
}

export function CommunityPostDialog({
  postId,
  open,
  onOpenChange,
  onPostChanged,
  onPostDeleted,
  onReactionChange,
  onRequestEdit,
}: CommunityPostDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()

  const [post, setPost] = useState<CommunityPostDetail | null>(null)
  const [comments, setComments] = useState<CommunityComment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  const isOwner = Boolean(user && post && user.id === post.authorId)
  const mediaItems = useMemo(() => {
    if (!post) return []

    const orderedSecondaryMedia = [...(post.media ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    const items: Array<{ id: string; imageUrl: string; caption?: string; label: string }> = []

    if (post.coverUrl) {
      items.push({
        id: "cover",
        imageUrl: post.coverUrl,
        label: "Ảnh bìa",
      })
    }

    orderedSecondaryMedia.forEach((media, index) => {
      items.push({
        id: media.id,
        imageUrl: media.imageUrl,
        caption: media.caption,
        label: `Ảnh ${index + 1}`,
      })
    })

    return items
  }, [post])

  useEffect(() => {
    if (open && postId) {
      void loadPostData()
    } else {
      setPost(null)
      setComments([])
      setNewComment("")
      setActiveMediaIndex(0)
    }
  }, [open, postId])

  useEffect(() => {
    setActiveMediaIndex(0)
  }, [post?.id])

  const loadPostData = async () => {
    if (!postId) return
    setIsLoading(true)
    try {
      const [postData, commentsData] = await Promise.all([api.community.getPostById(postId), api.community.getComments(postId)])
      setPost(postData)
      setComments(commentsData)
    } catch {
      toast({ title: "Lỗi", description: "Không thể tải bài viết.", variant: "destructive" })
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      toast({ title: "Yêu cầu đăng nhập", description: "Vui lòng đăng nhập để thích bài viết." })
      return
    }
    if (!post) return

    const nextLiked = !post.hasLiked
    const nextLikes = post.totalLikes + (nextLiked ? 1 : -1)

    setPost((prev) => (prev ? { ...prev, hasLiked: nextLiked, totalLikes: nextLikes } : null))
    onReactionChange?.(post.id, { hasLiked: nextLiked, totalLikes: nextLikes })

    try {
      await api.community.toggleReaction(post.id, "like")
    } catch (error) {
      setPost((prev) => (prev ? { ...prev, hasLiked: !nextLiked, totalLikes: prev.totalLikes + (nextLiked ? -1 : 1) } : null))
      onReactionChange?.(post.id, {
        hasLiked: !nextLiked,
        totalLikes: nextLikes + (nextLiked ? -1 : 1),
      })
      toast({ title: "Lỗi", description: "Không thể thực hiện thao tác", variant: "destructive" })
    }
  }

  const handleToggleSave = async () => {
    if (!user) {
      toast({ title: "Yêu cầu đăng nhập", description: "Vui lòng đăng nhập để lưu bài viết." })
      return
    }
    if (!post) return

    const nextSaved = !post.hasSaved
    setPost((prev) => (prev ? { ...prev, hasSaved: nextSaved } : null))
    onReactionChange?.(post.id, { hasSaved: nextSaved })

    try {
      await api.community.toggleReaction(post.id, "save")
    } catch {
      setPost((prev) => (prev ? { ...prev, hasSaved: !nextSaved } : null))
      onReactionChange?.(post.id, { hasSaved: !nextSaved })
      toast({ title: "Lỗi", description: "Không thể lưu bài viết.", variant: "destructive" })
    }
  }

  const handleReport = async () => {
    if (!user || !post) return
    const reason = prompt("Lý do báo cáo bài viết này?")
    if (reason && reason.trim()) {
      try {
        await api.community.reportPost(post.id, reason)
        toast({ title: "Thành công", description: "Đã gửi báo cáo." })
      } catch {
        toast({ title: "Lỗi", description: "Không thể báo cáo.", variant: "destructive" })
      }
    }
  }

  const handleDelete = async () => {
    if (!post) return
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return

    try {
      await api.community.deletePost(post.id)
      toast({ title: "Đã xóa", description: "Bài viết đã được xóa." })
      onOpenChange(false)
      onPostDeleted?.(post.id)
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể xóa bài viết.", variant: "destructive" })
    }
  }

  const handleSubmitComment = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user) {
      toast({ title: "Yêu cầu đăng nhập", description: "Vui lòng đăng nhập để bình luận." })
      return
    }
    if (!newComment.trim() || !post) return

    setIsSubmittingComment(true)
    try {
      const newCommentData = await api.community.createComment(post.id, newComment)
      setComments((prev) => [...prev, newCommentData])
      setPost((prev) => (prev ? { ...prev, totalComments: prev.totalComments + 1 } : null))
      onReactionChange?.(post.id, { totalComments: (post.totalComments ?? 0) + 1 })
      setNewComment("")
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể gửi bình luận", variant: "destructive" })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const activeMedia = mediaItems[activeMediaIndex]
  const hasMedia = mediaItems.length > 0

  const goToPreviousMedia = () => {
    setActiveMediaIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1))
  }

  const goToNextMedia = () => {
    setActiveMediaIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`overflow-hidden p-0 rounded-xl ${
          hasMedia ? "h-[90vh] max-w-6xl flex flex-col md:flex-row" : "max-w-2xl flex flex-col"
        }`}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{post?.title || "Chi tiết bài viết"}</DialogTitle>
          <DialogDescription>Xem chi tiết bài viết và bình luận từ cộng đồng.</DialogDescription>
        </DialogHeader>

        {isLoading || !post ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {hasMedia && (
              <div className="relative flex min-h-[260px] w-full flex-1 items-center justify-center bg-black md:min-h-0">
                <div className="relative flex h-full w-full items-center justify-center">
                  <img
                    src={activeMedia?.imageUrl}
                    alt={post.title}
                    className="max-h-full w-full object-contain"
                  />

                  {mediaItems.length > 1 && (
                    <>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                        onClick={goToPreviousMedia}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full"
                        onClick={goToNextMedia}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </>
                  )}
                </div>

                {mediaItems.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/45 px-3 py-2">
                    {mediaItems.map((media, index) => (
                      <button
                        key={media.id}
                        type="button"
                        className={`h-2.5 w-2.5 rounded-full transition-colors ${
                          index === activeMediaIndex ? "bg-white" : "bg-white/40"
                        }`}
                        onClick={() => setActiveMediaIndex(index)}
                        aria-label={`Chuyển tới ${media.label}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={`flex min-h-0 flex-col bg-white ${hasMedia ? "w-full md:w-[420px]" : "w-full"}`}>
              <div className="flex shrink-0 items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    {post.authorAvatarUrl ? (
                      <img src={post.authorAvatarUrl} alt={post.authorName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold uppercase text-gray-500">
                        {post.authorName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold leading-tight text-gray-900">{post.authorName}</h3>
                      {post.authorRole === "artist" && (
                        <span className="rounded border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                          Nghệ nhân
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + `/community?post=${post.id}`)
                        toast({ description: "Đã sao chép liên kết" })
                      }}
                    >
                      Sao chép liên kết
                    </DropdownMenuItem>
                    {isOwner ? (
                      <>
                        <DropdownMenuItem onClick={() => onRequestEdit?.(post.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="font-medium text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa bài
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem onClick={handleReport} className="font-medium text-red-500">
                        Báo cáo
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <h2 className="mb-2 text-xl font-bold text-gray-900">{post.title}</h2>
                {post.content && <p className="mb-4 whitespace-pre-wrap text-sm text-gray-700">{post.content}</p>}

                <div className="my-4 h-px w-full bg-gray-100" />

                <h3 className="mb-4 text-sm font-semibold">Bình luận ({post.totalComments})</h3>
                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">Chưa có bình luận nào.</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
                          {comment.authorAvatarUrl ? (
                            <img src={comment.authorAvatarUrl} alt={comment.authorName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold uppercase text-gray-500">
                              {comment.authorName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold">{comment.authorName}</span>
                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm text-gray-800">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="shrink-0 border-t bg-gray-50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={handleToggleLike} className="flex items-center gap-1.5 transition-colors hover:text-red-500">
                      <Heart className={`h-6 w-6 ${post.hasLiked ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
                      <span className="font-medium text-gray-700">{post.totalLikes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 transition-colors hover:text-primary">
                      <MessageCircle className="h-6 w-6 text-gray-700" />
                      <span className="font-medium text-gray-700">{post.totalComments}</span>
                    </button>
                    <button
                      className="flex items-center transition-colors hover:text-primary"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + `/community?post=${post.id}`)
                        toast({ description: "Đã sao chép liên kết" })
                      }}
                    >
                      <Share2 className="h-6 w-6 text-gray-700" />
                    </button>
                  </div>
                  <button onClick={handleToggleSave} className="transition-colors hover:text-primary">
                    <Bookmark className={`h-6 w-6 ${post.hasSaved ? "fill-gray-900 text-gray-900" : "text-gray-700"}`} />
                  </button>
                </div>

                <form onSubmit={handleSubmitComment} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Thêm bình luận..."
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                      className="rounded-full border-gray-300 bg-white px-4 focus-visible:ring-primary"
                      disabled={isSubmittingComment}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="shrink-0 rounded-full bg-primary hover:bg-primary/90"
                      disabled={isSubmittingComment || !newComment.trim()}
                    >
                      {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
