"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ShinyText from "@/components/ShinyText";

export function ProjectInfoSection() {
  return (
    <>
      <section className="bg-black pt-16 pb-4 md:pt-24 md:pb-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative md:col-span-5"
            >
              <div className="relative p-4">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary" />

                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/go-chau-thien-hoi.png"
                    alt="GÕ CHẦU THIÊN HỘI"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 bg-[#EEF2FF] p-8 rounded-2xl shadow-xl h-full flex flex-col justify-center md:col-span-7"
            >
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                <ShinyText
                  text="GÕ CHẦU THIÊN HỘI"
                  gradient="#393ADD, #5E61FF, #1E1F8C"
                  speed={3}
                  spread={90}
                />
              </h2>
              <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                Một hành trình đánh thức nhịp văn hóa đang ngủ sâu bên trong mỗi
                người con đất Việt. Với <span className="font-bold">Gõ Chầu</span>{" "}
                là một nhịp phách thiêng liêng vọng về từ quá khứ, khơi dậy ký ức
                và niềm tin văn hóa của mỗi người. Và{" "}
                <span className="font-bold">Thiên Hội</span> tượng trưng cho không
                gian giao hòa linh thiêng, nơi con người được sống trọn vẹn, kết
                nối sâu sắc và tự mình giữ lửa cho dòng chảy bất tận của di sản.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-black pt-4 pb-16 md:pt-6 md:pb-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6 bg-[#EEF2FF] p-8 rounded-2xl shadow-xl h-full flex flex-col justify-center md:col-span-7"
            >
              <h2
                className="text-2xl md:text-4xl font-bold leading-tight w-full"
                suppressHydrationWarning
              >
                <div className="text-left">
                  <ShinyText
                    text="BẮC PHƯƠNG TIỀN SẮC"
                    gradient="#393ADD, #5E61FF, #1E1F8C"
                    speed={3}
                    spread={90}
                  />
                </div>
                <div className="text-right">
                  <ShinyText
                    text="HẬU CHÍ TRỜI NAM"
                    gradient="#393ADD, #5E61FF, #1E1F8C"
                    speed={3}
                    spread={90}
                    delay={0.5}
                  />
                </div>
              </h2>
              <p className="text-gray-800 leading-relaxed text-sm md:text-base">
                Một lời tuyên ngôn khắc họa sự giao thoa và lan tỏa của Tín ngưỡng
                Thờ Mẫu, từ những sắc phong thiêng liêng nơi{" "}
                <span className="font-bold">phương Bắc</span>, di sản theo dòng
                người lan tỏa khắp <span className="font-bold">trời Nam</span>, sống
                cùng cộng đồng, biến thiên theo thời gian nhưng vẫn giữ trọn cốt
                lõi. Một hành trình kết nối không gian và thời gian, đưa dòng chảy
                văn hóa tâm linh từ nơi khởi phát đi đến trọn vẹn mọi miền Tổ
                quốc.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative md:col-span-5"
            >
              <div className="relative p-4">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary" />
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary" />

                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/bac-phuong-tien-sac-hau-chi-troi-nam.png"
                    alt="Bắc Phương Tiên Sắc Hậu Chí Trời Nam"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
