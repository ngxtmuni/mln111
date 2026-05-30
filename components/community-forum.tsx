import { MessageCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ForumThread {
  id: number
  title: string
  author: string
  category: string
  replies: number
  views: number
  lastReply: string
  isPinned: boolean
}

interface CommunityForumProps {
  threads: ForumThread[]
}

export default function CommunityForum({ threads }: CommunityForumProps) {
  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <Link key={thread.id} href={`/community/forum/${thread.id}`}>
          <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {thread.isPinned && (
                    <span className="px-2 py-1 bg-accent/20 text-accent text-xs font-semibold rounded">Ghim</span>
                  )}
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                    {thread.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {thread.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">Bởi {thread.author}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground whitespace-nowrap">
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{thread.replies}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{thread.views}</span>
                </div>
                <span className="text-xs">{thread.lastReply}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {/* New Thread Button */}
      <div className="pt-4">
        <Button className="w-full bg-primary hover:bg-primary/90">Tạo chủ đề mới</Button>
      </div>
    </div>
  )
}
