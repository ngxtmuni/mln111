import Link from "next/link"

export default function LibraryFeatured() {
  const featured = [
    {
      id: 1,
      title: "Lịch sử và phát triển của nghệ thuật Đông Hồ",
      description: "Khám phá nguồn gốc, phát triển và giá trị văn hóa của nghệ thuật in tranh Đông Hồ truyền thống",
      image: "/placeholder.svg?key=feat1",
      category: "Mỹ thuật",
    },
    {
      id: 2,
      title: "Nhạc cụ truyền thống Việt Nam",
      description: "Tìm hiểu về các nhạc cụ dân tộc Việt Nam, cách chế tạo và ứng dụng trong âm nhạc hiện đại",
      image: "/placeholder.svg?key=feat2",
      category: "Âm nhạc",
    },
    {
      id: 3,
      title: "Kiến trúc cổ truyền Việt Nam",
      description: "Phân tích đặc điểm kiến trúc, phong cách thiết kế và ý nghĩa văn hóa của các công trình cổ",
      image: "/placeholder.svg?key=feat3",
      category: "Kiến trúc",
    },
  ]

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-primary mb-6">Nội dung nổi bật</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {featured.map((item) => (
          <Link key={item.id} href={`/library/${item.id}`}>
            <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              </div>

              <div className="p-4">
                <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-2">{item.category}</p>
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
