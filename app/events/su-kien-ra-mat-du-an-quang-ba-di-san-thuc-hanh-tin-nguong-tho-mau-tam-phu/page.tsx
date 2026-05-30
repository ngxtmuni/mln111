"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, ArrowRight } from "lucide-react"
import Image from "next/image"

import ParallaxHero from "@/components/parallax-hero"
import Footer from "@/components/footer"
import VariableProximity from "@/components/VariableProximity"
import { DriveVideoSection } from "@/components/drive-video-section"

const galleryImages = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  src: `/events/su-kien-ra-mat/${i + 1}.webp`,
  alt: `Sự kiện ra mắt - Ảnh ${i + 1}`
}))

export default function Event1DetailsPage() {
  const containerRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="bg-black min-h-screen">
      {/* SECTION 1: HERO POSTER */}
      <ParallaxHero
        title="DÒNG CHẢY DI SẢN"
        description="Sự kiện đã kết thúc"
        imageUrl="/poster-event-1.png"
      >
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            {/* SECTION 2: TITLE */}
            <section className="py-12 bg-black text-center">
              <div className="relative inline-flex items-center justify-center mx-auto" ref={containerRef}>
                <img
                  src="/Cloud.png"
                  alt=""
                  className="absolute w-24 md:w-32 h-auto transform -left-4 md:left-1 -top-4 md:top-4 z-7 pointer-events-none"
                />
                <VariableProximity
                  label={'THỦ ĐÔ HÀ NỘI'}
                  className={'text-4xl md:text-6xl text-white tracking-tighter uppercase px-8 md:px-16 z-8'}
                  fromFontVariationSettings="'wght' 400, 'opsz' 9"
                  toFontVariationSettings="'wght' 1000, 'opsz' 40"
                  containerRef={containerRef}
                  radius={100}
                  falloff='linear'
                />
                <img
                  src="/Cloud-2.png"
                  alt=""
                  className="absolute w-24 md:w-36 h-auto -right-4 md:-right-8 -top-4 md:-top-8 z-7 pointer-events-none"
                />
              </div>
            </section>

            {/* SECTION 3: PROJECT POSTER */}
            <section className="bg-black flex justify-center px-4">
              <div className="max-w-6xl w-full">
                <img
                  src="/poster-event-1.png"
                  alt="Poster dự án"
                  className="w-full h-auto object-contain shadow-2xl rounded-sm"
                />
              </div>
            </section>

            {/* SECTION 4: PROJECT INFO */}
            <section className="py-20 bg-black">
              <div className="max-w-6xl mx-auto flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden border border-zinc-800 relative">
                <img
                  src="/canh-bien.png"
                  alt=""
                  className="hidden md:block absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-auto z-10 pointer-events-none"
                />
                <div className="md:w-[60%] bg-[#3031BA] p-8 md:p-12 text-white flex flex-col justify-center relative">
                  <img src="/Cloud-3.png" alt="Cloud" className="hidden md:block w-32 h-auto absolute top-12" />
                  <p className="italic text-sm md:text-base opacity-80 mb-6 font-light">
                    08h00 - 11h00, 06/03/2026
                  </p>
                  <h3 className="text-3xl md:text-4xl font-black leading-tight mb-8 uppercase">
                    RA MẮT DỰ ÁN QUẢNG BÁ DI SẢN THỰC HÀNH TÍN NGƯỠNG THỜ MẪU TAM PHỦ
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed opacity-90 font-light z-8 text-justify">
                    Với mong muốn tạo ra một không gian giao thoa giữa giá trị truyền thống và nhịp sống đương đại, thu hẹp khoảng cách giữa người trẻ và Tín ngưỡng Thờ Mẫu Tam Phủ. Đây không chỉ là hành trình tìm về cội nguồn mà còn là nỗ lực kiến tạo nên một nền tảng tri thức, một góc nhìn chính thống, đa chiều và gần gũi về Di sản Văn hóa Phi vật thể đại diện của nhân loại, đồng thời nỗ lực lan tỏa giá trị di sản đến thế hệ trẻ trên cả ba miền đất nước.
                  </p>
                  <img src="/Dan.png" alt="Dan" className="w-44 h-auto hidden md:block absolute bottom-8 right-10 z-7 opacity-55" />
                </div>

                <div className="md:w-[40%] bg-white p-8 md:p-12 text-[#393ADD] flex flex-col justify-center">
                  <div className="space-y-8">
                    <div>
                      <h4 className="font-bold text-lg mb-2">Ra mắt ấn phẩm nghiên cứu về Hát Văn của ông Ngô Nhật Tăng</h4>
                      <p className="text-sm leading-relaxed opacity-80 text-justify">
                        Nhằm phát huy vai trò của các nhà nghiên cứu, nghệ nhân trong việc đồng hành, cố vấn chuyên môn cho thế hệ trẻ trong việc xây dựng các chương trình quảng bá di sản văn hóa. Ấn phẩm về Hát Văn là cả một quá trình tâm huyết của người nghệ nhân với công trình nghiên cứu và phân tích hơn 100 bản văn cổ, các điển tích điển cố.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Ra mắt Thư viện số hóa Đạo Mẫu Việt Nam</h4>
                      <p className="text-sm leading-relaxed opacity-80 text-justify">
                        Thư viện là một tài sản trọng tâm của dự án, được phát triển từ kho tư liệu do nhóm nghiên cứu của bác Lê Văn Thao thực hiện, góp phần hệ thống hóa, bảo tồn và lan tỏa các giá trị tư liệu về tín ngưỡng thờ Mẫu.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Diễn đàn chia sẻ và giao lưu</h4>
                      <p className="text-sm leading-relaxed opacity-80 text-justify">
                        Cùng nhau lắng nghe những chia sẻ từ những thế hệ kì cựu đến thế hệ kế cận như thanh niên, về hành trình giữ lửa, thắp đuốc và lan tỏa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: RECAP VIDEO */}
            <DriveVideoSection
              youtubeVideoId="3jj8qkD19HU"
              title="RECAP HÀ NỘI"
              subtitle="Dòng Chảy Di Sản · 06/03/2026"
              description=""
              badge="Recap sự kiện"
            />

            {/* SECTION 6: POST-EVENT GALLERY */}
            <section className="py-24 bg-black">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#393ADD]/10 border border-[#393ADD]/20 text-[#393ADD] text-xs font-black uppercase tracking-[0.2em] mb-6"
                  >
                    <Camera size={14} className="animate-pulse" />
                    Khoảnh khắc sự kiện
                  </motion.div>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">KHOẢNH KHẮC DI SẢN</h2>
                  <div className="h-1.5 w-24 bg-[#393ADD] mx-auto rounded-full mb-8" />
                  <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-light">
                    Những hình ảnh đáng nhớ tại sự kiện ra mắt dự án. Nơi những giá trị văn hóa truyền thống được tôn vinh và kết nối với thế hệ trẻ.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {galleryImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-900 border border-zinc-800/50 cursor-zoom-in"
                      onClick={() => setSelectedImage(image.src)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Hover Overlay Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-[#393ADD] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Dòng chảy di sản</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs font-medium opacity-80">Hà Nội, 2026</span>
                          <div className="w-8 h-8 rounded-full bg-[#393ADD] flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      </ParallaxHero>

      {/* Lightbox / Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/98 backdrop-blur-xl p-4 md:p-12"
          >
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-all hover:rotate-90 z-[10000]"
              onClick={() => setSelectedImage(null)}
            >
              <X size={48} strokeWidth={1} />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Ảnh phóng lớn"
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_100px_rgba(57,58,221,0.2)] border border-white/5"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
