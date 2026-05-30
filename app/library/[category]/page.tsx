"use client"

import ParallaxHero from "@/components/parallax-hero";
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { useParams } from "next/navigation";
import Link from "next/link";

const categories = [
  { id: "thanh-nhan", title: "Thánh Nhân" },
  { id: "ma-le", title: "Mã Lệ" },
  { id: "chau-van", title: "Châu Văn" }
];

const libraryItems = [
  { id: 1, title: "Tác phẩm 1", image: "https://picsum.photos/seed/lib1/400/400" },
  { id: 2, title: "Tác phẩm 2", image: "https://picsum.photos/seed/lib2/400/400" },
  { id: 3, title: "Tác phẩm 3", image: "https://picsum.photos/seed/lib3/400/400" },
  { id: 4, title: "Tác phẩm 4", image: "https://picsum.photos/seed/lib4/400/400" },
  { id: 5, title: "Tác phẩm 5", image: "https://picsum.photos/seed/lib5/400/400" },
  { id: 6, title: "Tác phẩm 6", image: "https://picsum.photos/seed/lib6/400/400" },
  { id: 7, title: "Tác phẩm 7", image: "https://picsum.photos/seed/lib7/400/400" },
  { id: 8, title: "Tác phẩm 8", image: "https://picsum.photos/seed/lib8/400/400" },
  { id: 9, title: "Tác phẩm 9", image: "https://picsum.photos/seed/lib9/400/400" },
];

export default function LibraryCategoryPage() {
  const params = useParams();
  const currentCategory = params.category as string;
  
  const categoryInfo = categories.find(c => c.id === currentCategory);
  const categoryTitle = categoryInfo?.title || "Thánh Nhân";

  return (
    <ParallaxHero
      title="THƯ VIỆN"
      description="Dự án truyền thông quảng bá Vai trò của di sản Văn hoá Phi vật thể tín ngưỡng Thờ Mẫu Tam Phủ của người Việt trong việc xây dựng văn hóa cộng đồng từ Bắc vào Nam thông qua những hoạt động văn hóa, sự kiện truyền thông thú vị"
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
    >
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">

          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.3 }}
            className="py-12"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                THƯ VIỆN {categoryTitle.toUpperCase()}
              </h2>
              
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/library/${cat.id}`}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      currentCategory === cat.id
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {libraryItems.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <div className="aspect-square bg-gray-700 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="bg-gray-700 rounded py-2 px-3">
                      <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
        <Footer />
      </main>
    </ParallaxHero>
  )
}
