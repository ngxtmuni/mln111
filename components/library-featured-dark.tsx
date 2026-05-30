import Link from "next/link"
import { motion } from "framer-motion"

export default function LibraryFeaturedDark() {
  const featured = [
    {
      id: 1,
      title: "Lịch sử và phát triển của nghệ thuật Đông Hồ",
      description: "Khám phá nguồn gốc, phát triển và giá trị văn hóa của nghệ thuật in tranh Đông Hồ truyền thống",
      image: "/placeholder.svg",
      category: "Mỹ thuật",
    },
    {
      id: 2,
      title: "Nhạc cụ truyền thống Việt Nam",
      description: "Tìm hiểu về các nhạc cụ dân tộc Việt Nam, cách chế tạo và ứng dụng trong âm nhạc hiện đại",
      image: "/placeholder.svg",
      category: "Âm nhạc",
    },
    {
      id: 3,
      title: "Kiến trúc cổ truyền Việt Nam",
      description: "Phân tích đặc điểm kiến trúc, phong cách thiết kế và ý nghĩa văn hóa của các công trình cổ",
      image: "/placeholder.svg",
      category: "Kiến trúc",
    },
  ]

  return (
    <motion.section 
      className="mb-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-primary pl-4">Nội dung nổi bật</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {featured.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <Link href={`/library/${item.id}`}>
              <div className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-primary transition-all duration-300 h-full cursor-pointer">
                <div className="relative h-56 overflow-hidden bg-zinc-800">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="p-5">
                  <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">{item.category}</p>
                  <h3 className="font-bold text-white group-hover:text-primary/80 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
