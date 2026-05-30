"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { api, CommunityPost } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, MoreVertical, Loader2, Trash2, Pencil } from "lucide-react"
import { CommunityPostDialog } from "@/components/community-post-dialog"
import { CommunityPostEditorDialog } from "@/components/community-post-editor-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardCommunityPage() {
  const [activeTab, setActiveTab] = useState("my-posts")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [refreshSignal, setRefreshSignal] = useState(0)

  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="border-b pb-4 text-2xl font-bold tracking-tight text-gray-900">Quản lý Cộng Đồng</h1>
        <p className="mt-2 text-muted-foreground">Theo dõi và quản lý các bài viết cùng hoạt động của bạn trên cộng đồng</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="my-posts">Đã đăng</TabsTrigger>
          <TabsTrigger value="saved">Đã lưu</TabsTrigger>
          <TabsTrigger value="liked">Đã thích</TabsTrigger>
          <TabsTrigger value="commented">Bình luận</TabsTrigger>
        </TabsList>

        <TabsContent value="my-posts" className="mt-0">
          <PostList
            refreshSignal={refreshSignal}
            fetchFn={(page) => api.community.getMyPosts(page, 20)}
            onOpenPost={(id) => {
              setSelectedPostId(id)
              setDialogOpen(true)
            }}
            onEditPost={(id) => {
              setEditingPostId(id)
              setEditorOpen(true)
            }}
            isOwnerView
          />
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          <PostList
            refreshSignal={refreshSignal}
            fetchFn={(page) => api.community.getSavedPosts(page, 20)}
            onOpenPost={(id) => {
              setSelectedPostId(id)
              setDialogOpen(true)
            }}
          />
        </TabsContent>
        <TabsContent value="liked" className="mt-0">
          <PostList
            refreshSignal={refreshSignal}
            fetchFn={(page) => api.community.getLikedPosts(page, 20)}
            onOpenPost={(id) => {
              setSelectedPostId(id)
              setDialogOpen(true)
            }}
          />
        </TabsContent>
        <TabsContent value="commented" className="mt-0">
          <PostList
            refreshSignal={refreshSignal}
            fetchFn={(page) => api.community.getCommentedPosts(page, 20)}
            onOpenPost={(id) => {
              setSelectedPostId(id)
              setDialogOpen(true)
            }}
          />
        </TabsContent>
      </Tabs>

      <CommunityPostDialog
        postId={selectedPostId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPostChanged={triggerRefresh}
        onPostDeleted={() => {
          setDialogOpen(false)
          triggerRefresh()
        }}
        onRequestEdit={(postId) => {
          setDialogOpen(false)
          setEditingPostId(postId)
          setEditorOpen(true)
        }}
        onReactionChange={triggerRefresh}
      />

      <CommunityPostEditorDialog
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open)
          if (!open) {
            setEditingPostId(null)
          }
        }}
        mode="edit"
        postId={editingPostId}
        onSuccess={() => {
          setEditorOpen(false)
          triggerRefresh()
        }}
      />
    </div>
  )
}

function PostList({
  fetchFn,
  onOpenPost,
  onEditPost,
  isOwnerView = false,
  refreshSignal,
}: {
  fetchFn: (page: number) => Promise<any>
  onOpenPost: (id: string) => void
  onEditPost?: (id: string) => void
  isOwnerView?: boolean
  refreshSignal: number
}) {
  const { toast } = useToast()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const loadData = async (pageNum: number) => {
    setIsLoading(true)
    try {
      const res = await fetchFn(pageNum)
      setPosts((prev) => (pageNum === 1 ? res.items : [...prev, ...res.items]))
      setHasMore(pageNum < res.totalPages)
      setPage(pageNum)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData(1)
  }, [refreshSignal])

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return
    try {
      await api.community.deletePost(id)
      setPosts((prev) => prev.filter((post) => post.id !== id))
      toast({ title: "Đã xóa", description: "Bài viết đã bị xóa." })
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể xóa bài viết", variant: "destructive" })
    }
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (posts.length === 0) {
    return <div className="rounded-xl bg-gray-50 py-12 text-center text-gray-500">Không có bài viết nào ở đây.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={post.id}
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-video w-full cursor-pointer overflow-hidden bg-gray-100" onClick={() => onOpenPost(post.id)}>
              {post.coverUrl || post.imageUrls?.[0] ? (
                <img
                  src={post.coverUrl || post.imageUrls?.[0]}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-neutral-800 to-neutral-950 p-4 text-white">
                  <MessageCircle className="h-6 w-6 text-primary/50" />
                  <p className="line-clamp-3 text-sm italic text-white/80">{post.content || "Bài viết văn bản"}</p>
                </div>
              )}
              {post.status === "PENDING" && (
                <div className="absolute left-2 top-2 rounded bg-yellow-500 px-2 py-1 text-xs font-bold text-white">
                  Chờ duyệt / Bị ẩn
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 cursor-pointer font-semibold text-gray-900 transition-colors hover:text-primary" onClick={() => onOpenPost(post.id)}>
                  {post.title}
                </h3>
                {isOwnerView && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEditPost && (
                        <DropdownMenuItem onClick={() => onEditPost(post.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Sửa bài
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDelete(post.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Xóa bài
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className={`h-4 w-4 ${post.hasLiked ? "fill-red-500 text-red-500" : ""}`} /> {post.totalLikes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" /> {post.totalComments}
                  </span>
                </div>
                <span className="text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => void loadData(page + 1)} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Tải thêm
          </Button>
        </div>
      )}
    </div>
  )
}
