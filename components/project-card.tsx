import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin } from "lucide-react"

interface ProjectCardProps {
  id: number
  title: string
  category: string
  description: string
  image: string
  status: "active" | "upcoming" | "completed"
  startDate: string
  location: string
  members: number
}

export default function ProjectCard({
  id,
  title,
  category,
  description,
  image,
  status,
  startDate,
  location,
  members,
}: ProjectCardProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    active: "Đang diễn ra",
    upcoming: "Sắp tới",
    completed: "Hoàn thành",
  }

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
          {statusLabels[status]}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">{category}</p>
        <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>

        {/* Meta Info */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{startDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{members} thành viên</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border">
          <Link href={`/projects/${id}`}>
            <Button className="w-full bg-primary hover:bg-primary/90">Chi tiết dự án</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
