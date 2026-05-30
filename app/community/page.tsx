"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Image, Loader2, Plus } from "lucide-react";
import ParallaxHero from "@/components/parallax-hero";
import { api, CommunityPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { CommunityUploadDialog } from "@/components/community-upload-dialog";
import { CommunityPostDialog } from "@/components/community-post-dialog";
import { CommunityPostEditorDialog } from "@/components/community-post-editor-dialog";
import { useToast } from "@/components/ui/use-toast";

const MasonryGallery = dynamic(() => import("@/components/masonry-gallery"), {
  ssr: false,
  loading: () => <p className="py-8 text-center">Đang tải nội dung cộng đồng...</p>,
});

export default function CommunityPage() {
  const { user, firebaseUser, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const isAuthenticated = Boolean(firebaseUser || user);

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  const loadPosts = async (pageToLoad: number, refresh = false) => {
    setIsLoading(true);
    try {
      const res = await api.community.getPosts({ page: pageToLoad, limit: 12 });
      setPosts((prev) => (refresh ? res.items : [...prev, ...res.items]));
      setHasMore(pageToLoad < res.totalPages);
      setPage(pageToLoad);
    } catch (error) {
      console.error(error);
      toast({ title: "Lỗi", description: "Không thể tải bài viết cộng đồng.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    void loadPosts(1, true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const postFromQuery = new URLSearchParams(window.location.search).get("post");
    if (postFromQuery && postFromQuery !== selectedPostId) {
      setSelectedPostId(postFromQuery);
      setPostDialogOpen(true);
    }
  }, [selectedPostId]);

  const updatePostQuery = (postId: string | null) => {
    if (typeof window === "undefined") return;
    const nextParams = new URLSearchParams(window.location.search);
    if (postId) {
      nextParams.set("post", postId);
    } else {
      nextParams.delete("post");
    }
    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
  };

  const openPostDialog = (id: string) => {
    setSelectedPostId(id);
    setPostDialogOpen(true);
    updatePostQuery(id);
  };

  const handleOpenEditor = (postId: string) => {
    setEditingPostId(postId);
    setEditorDialogOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) return;

    try {
      await api.community.deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      if (selectedPostId === postId) {
        setPostDialogOpen(false);
      }
      toast({ title: "Đã xóa", description: "Bài viết đã được xóa." });
    } catch (error: any) {
      toast({ title: "Lỗi", description: error.message || "Không thể xóa bài viết.", variant: "destructive" });
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!isAuthenticated) {
      toast({ title: "Yêu cầu đăng nhập", description: "Vui lòng đăng nhập để thích bài viết." });
      return;
    }

    const currentPost = posts.find((post) => post.id === postId);
    if (!currentPost) return;

    const nextLiked = !currentPost.hasLiked;
    const nextLikes = currentPost.totalLikes + (nextLiked ? 1 : -1);
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, hasLiked: nextLiked, totalLikes: nextLikes } : post)),
    );

    try {
      await api.community.toggleReaction(postId, "like");
    } catch (error) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, hasLiked: currentPost.hasLiked, totalLikes: currentPost.totalLikes }
            : post,
        ),
      );
      toast({ title: "Lỗi", description: "Không thể thích bài viết.", variant: "destructive" });
    }
  };

  const patchPostState = (
    postId: string,
    updates: Partial<Pick<CommunityPost, "hasLiked" | "hasSaved" | "totalLikes" | "totalComments">>,
  ) => {
    setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, ...updates } : post)));
  };

  const refreshSingleList = async () => {
    await loadPosts(1, true);
  };

  return (
    <ParallaxHero
      title="Cộng Đồng"
      subtitle="Lan tỏa di sản"
      description="Kết nối với những người yêu thích di sản văn hóa Việt Nam, chia sẻ tác phẩm và tham gia các cuộc thi."
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
    >
      <main className="min-h-screen bg-black">
        <motion.div
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="text-3xl font-bold text-white">Khám Phá Di Sản qua Lăng Kính Cộng Đồng</h2>
            {isAuthLoading && !isAuthenticated ? (
              <Button disabled className="bg-primary/60 text-white shadow-md">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xác thực
              </Button>
            ) : isAuthenticated ? (
              <Button onClick={() => setUploadDialogOpen(true)} className="bg-primary shadow-md hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Tạo Bài Viết
              </Button>
            ) : (
              <Link href="/login?redirect=/community">
                <Button variant="outline" className="border-primary bg-black text-primary hover:bg-white/5">
                  Đăng nhập để chia sẻ
                </Button>
              </Link>
            )}
          </div>

          {isInitialLoad ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center shadow-sm backdrop-blur-sm">
              <Image className="mx-auto mb-4 h-12 w-12 text-white/40" />
              <h3 className="text-xl font-semibold text-white">Chưa có bài viết nào</h3>
              <p className="mx-auto mt-2 max-w-md text-white/60">
                Hãy là người đầu tiên chia sẻ khoảnh khắc, cảm nghĩ về di sản văn hóa Việt Nam!
              </p>
            </div>
          ) : (
            <>
              <MasonryGallery
                items={posts}
                onPostClick={openPostDialog}
                currentUserId={user?.id ?? null}
                isAuthenticated={isAuthenticated}
                onToggleLike={handleToggleLike}
                onEditPost={handleOpenEditor}
                onDeletePost={handleDeletePost}
              />

              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => void loadPosts(page + 1)}
                    disabled={isLoading}
                    className="rounded-full border-white/15 bg-white/5 px-8 py-6 text-white shadow-sm hover:bg-white/10"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Tải thêm bài viết"}
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </main>

      <CommunityUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={() => void refreshSingleList()}
      />

      <CommunityPostEditorDialog
        open={editorDialogOpen}
        onOpenChange={(open) => {
          setEditorDialogOpen(open);
          if (!open) {
            setEditingPostId(null);
          }
        }}
        mode="edit"
        postId={editingPostId}
        onSuccess={(postId) => {
          setEditorDialogOpen(false);
          setEditingPostId(null);
          void refreshSingleList();
          if (selectedPostId === postId) {
            setPostDialogOpen(true);
          }
        }}
      />

      <CommunityPostDialog
        postId={selectedPostId}
        open={postDialogOpen}
        onOpenChange={(open) => {
          setPostDialogOpen(open);
          if (!open) {
            updatePostQuery(null);
          }
        }}
        onPostChanged={() => void refreshSingleList()}
        onPostDeleted={(postId) => {
          setPosts((prev) => prev.filter((post) => post.id !== postId));
          setSelectedPostId(null);
        }}
        onReactionChange={patchPostState}
        onRequestEdit={(postId) => {
          setPostDialogOpen(false);
          handleOpenEditor(postId);
        }}
      />
    </ParallaxHero>
  );
}
