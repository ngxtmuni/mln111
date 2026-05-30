"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data - in real app, fetch from API
const mockGalleryItems: Record<number, any> = {
  1: {
    id: 1,
    title: "Tranh Đông Hồ truyền thống",
    image: "/placeholder.svg?key=gal1",
    author: "Nguyễn Văn A",
    authorAvatar: "/placeholder.svg?key=avatar1",
    likes: 234,
    comments: 45,
    category: "Mỹ thuật",
    description: "Một tác phẩm tranh Đông Hồ truyền thống với những nét vẽ tinh tế và màu sắc rực rỡ.",
    createdAt: "2 ngày trước",
    comments_list: [
      { id: 1, author: "Trần Thị B", text: "Tác phẩm rất đẹp!", avatar: "/placeholder.svg?key=avatar2" },
      { id: 2, author: "Lê Văn C", text: "Kỹ thuật vẽ tuyệt vời!", avatar: "/placeholder.svg?key=avatar3" },
      {
        id: 3,
        author: "Phạm Thị D",
        text: "Yêu thích màu sắc của bức tranh này",
        avatar: "/placeholder.svg?key=avatar4",
      },
    ],
  },
  2: {
    id: 2,
    title: "Nhạc cụ dân tộc",
    image: "/placeholder.svg?key=gal2",
    author: "Trần Thị B",
    authorAvatar: "/placeholder.svg?key=avatar2",
    likes: 189,
    comments: 32,
    category: "Âm nhạc",
    description: "Bộ sưu tập các nhạc cụ dân tộc Việt Nam được chế tác thủ công.",
    createdAt: "3 ngày trước",
    comments_list: [
      { id: 1, author: "Nguyễn Văn A", text: "Rất tuyệt vời!", avatar: "/placeholder.svg?key=avatar1" },
      {
        id: 2,
        author: "Hoàng Văn E",
        text: "Những nhạc cụ này có giá trị lịch sử cao",
        avatar: "/placeholder.svg?key=avatar5",
      },
    ],
  },
}

export default function CommunityDetailPage({ params }: { params: { id: string } }) {
  const itemId = Number.parseInt(params.id)
  const item = mockGalleryItems[itemId] || mockGalleryItems[1]
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState("")

  return (
    <main className="min-h-screen bg-background pt-24">

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/community">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={18} />
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Image */}
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden bg-muted mb-6">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-auto object-cover" />
            </div>

            {/* Title and Category */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                  {item.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{item.title}</h1>
              <p className="text-muted-foreground">{item.description}</p>
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 py-6 border-y border-border">
              <img
                src={item.authorAvatar || "/placeholder.svg"}
                alt={item.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.author}</p>
                <p className="text-sm text-muted-foreground">{item.createdAt}</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">Theo dõi</Button>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Bình luận ({item.comments_list.length})</h2>

              {/* Comment Input */}
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex gap-4">
                  <img
                    src="/placeholder.svg?key=current-user"
                    alt="You"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="outline">Hủy</Button>
                      <Button className="bg-primary hover:bg-primary/90">Bình luận</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {item.comments_list.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4">
                    <img
                      src={comment.avatar || "/placeholder.svg"}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{comment.author}</p>
                      <p className="text-muted-foreground mt-1">{comment.text}</p>
                      <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                        <button className="hover:text-primary transition-colors">Thích</button>
                        <button className="hover:text-primary transition-colors">Trả lời</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {/* Stats Card */}
            <div className="bg-card border border-border rounded-lg p-6 mb-6 sticky top-20">
              <div className="space-y-4">
                {/* Likes */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Heart size={20} className="text-primary" />
                    <span className="text-foreground font-semibold">Lượt thích</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{item.likes}</span>
                </div>

                {/* Comments Count */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} className="text-accent" />
                    <span className="text-foreground font-semibold">Bình luận</span>
                  </div>
                  <span className="text-2xl font-bold text-accent">{item.comments}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-full gap-2 ${
                      isLiked
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-primary/10 hover:bg-primary/20 text-primary"
                    }`}
                  >
                    <Heart size={18} className={isLiked ? "fill-current" : ""} />
                    {isLiked ? "Đã thích" : "Thích"}
                  </Button>
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Share2 size={18} />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
