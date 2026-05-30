"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Globe, Users, Star, Award, CheckCircle } from "lucide-react"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { HeroPoster } from "@/components/hero-poster"
import ArtistChatbotDark from "@/components/artist-chatbot-dark";

type ArtistWork = {
  id: string | number
  image: string
  title: string
}

export default function ArtistDetailClient({ artist }: { artist: any }) {
  const [isFollowing, setIsFollowing] = useState(false)

  if (!artist || artist.id === 0) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <HeroPoster title="Lỗi" subtitle="Không tìm thấy nghệ nhân" />
        <div className="flex-grow flex items-center justify-center">
          <p>Rất tiếc, chúng tôi không tìm thấy thông tin cho nghệ nhân này.</p>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        <img
          src={artist.coverImage}
          alt={`Ảnh bìa của ${artist.name}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </section>

      <div className="container mx-auto px-4 -mt-48 md:-mt-56">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 items-end"
        >
          {/* Image and Basic Info */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <div className="relative h-48 w-48 md:h-64 md:w-64 rounded-full overflow-hidden border-4 border-black shadow-lg -mt-16 md:-mt-24">
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left mt-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
                {artist.name}
                {artist.verified && <CheckCircle size={24} className="text-green-500" />}
              </h1>
              <p className="text-primary text-lg font-semibold">Coming soon</p>
            </div>
          </div>

          {/* Stats and Actions */}
          <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
            <div className="grid grid-cols-3 gap-4 text-center w-full">
              <div>
                <p className="text-3xl font-bold text-white">{artist.works.length}</p>
                <p className="text-sm text-gray-400">Tác phẩm</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0 flex-shrink-0">
              <Button
                onClick={() => setIsFollowing(!isFollowing)}
                variant={isFollowing ? "default" : "outline"}
                className={`transition-colors duration-300 rounded-full px-6 font-semibold ${isFollowing ? "bg-primary hover:bg-primary text-white border-transparent" : "bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"}`}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </Button>
              <Button variant="outline" className="rounded-full px-6 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">Liên hệ</Button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-primary pl-4">Về nghệ nhân</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{artist.fullBio}</p>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-primary pl-4">Tác phẩm tiêu biểu</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(artist.works as ArtistWork[]).map((work) => (
                    <motion.div 
                      key={work.id} 
                      className="rounded-lg overflow-hidden aspect-square group relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-semibold">{work.title}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Sidebar */}
            <motion.div 
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <ArtistChatbotDark artistName={artist.name} artistSpecialty={artist.specialty} />
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">Thông tin liên hệ</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin size={16} className="text-primary" />
                    <span>{artist.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail size={16} className="text-primary" />
                    <a href={`mailto:${artist.email}`} className="hover:text-primary/80">{artist.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Globe size={16} className="text-primary" />
                    <a href={`https://${artist.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary/80">{artist.website}</a>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-4">Giải thưởng & Vinh danh</h3>
                <ul className="space-y-3 text-sm list-none">
                  <li className="flex items-center gap-3 text-gray-300"><Award size={16} className="text-yellow-500" /><span>Giải thưởng nghệ thuật quốc gia 2023</span></li>
                  <li className="flex items-center gap-3 text-gray-300"><Award size={16} className="text-yellow-500" /><span>Nghệ nhân ưu tú 2021</span></li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
