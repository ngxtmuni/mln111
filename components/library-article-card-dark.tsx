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

export default function LibraryArticleCardDark({
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
    <article className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-primary transition-all duration-300 group">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Image */}
        <div className="md:col-span-1 h-48 md:h-full overflow-hidden bg-zinc-800">
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
              <span className="px-3 py-1 bg-primary/10 text-primary/80 text-xs font-semibold rounded-full">{category}</span>
              <span className="px-3 py-1 bg-sky-500/10 text-sky-400 text-xs font-semibold rounded-full">{type}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary/80 transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="text-gray-400 mb-4 line-clamp-3">{excerpt}</p>
          </div>

          {/* Meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} />
                <span>{readTime} phút đọc</span>
              </div>
            </div>

            <Link href={`/library/${id}`} passHref>
              <Button variant="outline" className="mt-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                Đọc tiếp
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
