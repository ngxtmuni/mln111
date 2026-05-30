import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function FeaturedProjects() {
  const projects = [
    {
      id: 1,
      title: "Nghệ thuật Đông Hồ",
      category: "Mỹ thuật truyền thống",
      description: "Bảo tồn và phát triển nghệ thuật in tranh Đông Hồ - di sản văn hóa phi vật thể",
      image: "/vietnamese-dong-ho-woodblock-painting-art-traditio.jpg",
      members: 234,
    },
    {
      id: 2,
      title: "Nhạc dân tộc Việt",
      category: "Âm nhạc",
      description: "Tập hợp các nhạc cụ truyền thống và bài hát dân tộc Việt Nam",
      image: "/vietnamese-traditional-musical-instruments-folk-mu.jpg",
      members: 456,
    },
    {
      id: 3,
      title: "Kiến trúc cổ Việt",
      category: "Kiến trúc",
      description: "Tài liệu về kiến trúc cổ truyền và các di tích lịch sử Việt Nam",
      image: "/vietnamese-ancient-architecture-temples-pagodas-hi.jpg",
      members: 189,
    },
  ]

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Nổi bật</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary">Dự án tiêu biểu</h2>
          </div>
          <Link href="/projects">
            <Button variant="outline" className="hidden md:flex gap-2 bg-transparent">
              Xem tất cả <ArrowRight size={16} />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">{project.category}</p>
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">{project.members} thành viên</span>
                  <Link href={`/projects/${project.id}`}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-accent">
                      Chi tiết →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/projects" className="block">
            <Button className="w-full bg-primary hover:bg-primary/90">Xem tất cả dự án</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
