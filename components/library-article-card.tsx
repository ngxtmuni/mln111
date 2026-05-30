import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, BookOpen } from "lucide-react"

interface LibraryArticleCardProps {
  id: number
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  readTime: number
  image: string
  type: string
}

export default function LibraryArticleCard({
  id,
  title,
  excerpt,
  author,
  date,
  category,
  readTime,
  image,
  type,
}: LibraryArticleCardProps) {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Image */}
        <div className="md:col-span-1 h-48 md:h-auto overflow-hidden bg-muted">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">{category}</span>
              <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded">{type}</span>
            </div>

            <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-muted-foreground mb-4 line-clamp-3">{excerpt}</p>
          </div>

          {/* Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen size={16} />
                <span>{readTime} phút đọc</span>
              </div>
            </div>

            <Link href={`/library/${id}`}>
              <Button className="bg-primary hover:bg-primary/90">Đọc tiếp</Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
