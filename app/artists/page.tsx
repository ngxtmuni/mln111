'use client'

import { useState } from "react"
import ArtistCardDark from "@/components/artist-card-dark"
import ParallaxHero from "@/components/parallax-hero";
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { allArtists } from "@/lib/artists"

export default function ArtistsPage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")

  const specialties = [
    { id: "all", label: "Tất cả" },
    { id: "painting", label: "Hội họa" },
    { id: "music", label: "Âm nhạc" },
    { id: "architecture", label: "Kiến trúc" },
    { id: "craft", label: "Thủ công" },
  ]

  const filteredArtists =
    selectedSpecialty === "all" ? allArtists : allArtists.filter((artist) => artist.specialtyId === selectedSpecialty)

  return (
    <ParallaxHero
      title="Nghệ Nhân"
      subtitle="Kết nối tinh hoa"
      description="Khám phá và kết nối với các nghệ nhân tài năng, những người gìn giữ và phát huy giá trị di sản văn hóa Việt Nam."
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
    >
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-center text-white mb-6">Lọc theo chuyên môn</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {specialties.map((specialty) => (
                <Button
                  key={specialty.id}
                  variant={selectedSpecialty === specialty.id ? "default" : "outline"}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  className={`transition-colors duration-300 rounded-full px-6 py-2 text-sm font-semibold 
                    ${selectedSpecialty === specialty.id
                      ? "bg-primary-500 hover:bg-primary-600 text-white border-transparent"
                      : "bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"}`}
                >
                  {specialty.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Artists Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {filteredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <ArtistCardDark {...artist} />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bạn là một nghệ nhân?</h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Chia sẻ kỹ năng và kinh nghiệm của bạn với cộng đồng. Trở thành một phần của phong trào bảo tồn di sản văn hóa Việt Nam.
            </p>
            <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-3 rounded-lg transition-transform hover:scale-105">
              Đăng ký làm nghệ nhân
            </Button>
          </motion.section>
        </div>

        <Footer />
      </main>
    </ParallaxHero>
  )
}
