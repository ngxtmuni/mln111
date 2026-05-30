"use client";

import Link from "next/link";
import Footer from "@/components/footer";
import ParallaxHero from "@/components/parallax-hero";
import { RegionTimeline } from "@/components/region-timeline";
import { motion } from "framer-motion";
import EventCarousel, { type Event as CarouselEvent } from "@/components/event-carousel";
import { useState } from "react";
import { REGION_DATA } from "@/lib/constants";

// Split components
import { ProjectInfoSection } from "@/components/projects/project-info-section";
import { ContestSection } from "@/components/home/contest-section";
import { StatsSection } from "@/components/projects/stats-section";
import { DocumentarySection } from "@/components/projects/documentary-section";

export default function ProjectsPage() {
  const [activeEvent, setActiveEvent] = useState<CarouselEvent | null>(null);

  return (
    <main className="min-h-screen bg-black">
      <ParallaxHero
        title={<span>GÕ CHẦU THIÊN HỘI</span>}
        description={
          <>
            Dự án truyền thông nhằm lan tỏa giá trị
            <br className="hidden md:block" /> của Thực hành Tín ngưỡng
            Thờ Mẫu Tam Phủ đến với người trẻ Việt trên toàn quốc
          </>
        }
        textMainClass="text-[#393ADD]"
        descriptionClass="text-gray-300"
      >
        {/* Project Info (Gõ Chầu Thiên Hội & Bắc Phương Tiền Sắc) */}
        <ProjectInfoSection />

        {/* Region Timeline Section */}
        <section className="bg-black py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl md:text-5xl font-bold text-white mb-12"
            >
              Hành trình Bắc - Trung - Nam
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <RegionTimeline regions={REGION_DATA} />
            </motion.div>
          </div>
        </section>

        {/* Documentary Film Section */}
        <DocumentarySection />

        {/* Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative py-20 px-4 md:px-12 bg-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white md:col-span-4 flex flex-col md:h-full md:pb-16"
            >
              <div>
                <h2 className="text-3xl md:text-7xl font-bold text-left mb-2 text-[#393ADD] leading-tight">
                  Dòng Chảy <br /> Di Sản
                </h2>
                <div className="mb-8 mt-4">
                  {activeEvent?.status === "ended" ? (
                    <Link href={`/events/${activeEvent.slug}`}>
                      <button className="bg-[#393ADD] hover:bg-[#3031BA] text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg text-sm uppercase tracking-wider">
                        Xem thêm
                      </button>
                    </Link>
                  ) : activeEvent?.status === "open" ? (
                    <Link href={`/events/${activeEvent.slug}`}>
                      <button className="bg-[#393ADD] hover:bg-[#3031BA] text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg text-sm uppercase tracking-wider">
                        Đăng ký ngay
                      </button>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="bg-zinc-800 text-zinc-500 font-bold px-8 py-3 rounded-full cursor-not-allowed text-sm uppercase tracking-wider"
                    >
                      Sắp mở đăng ký
                    </button>
                  )}
                </div>
              </div>
              <p className="text-white leading-relaxed md:mt-auto text-justify text-lg md:text-xl">
                Điểm hẹn của những trái tim yêu văn hóa, nơi mỗi sự kiện là một
                nhịp cầu đưa thế hệ trẻ chạm vào hồn cốt dân tộc, nơi chúng ta
                cùng nhau gìn giữ ngọn lửa tâm linh và lan tỏa sắc hương di sản
                Việt trường tồn cùng thời gian
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="md:col-span-8"
            >
              <EventCarousel onEventChange={setActiveEvent} />
            </motion.div>
          </div>
        </motion.section>

        {/* Contest Section (Shared) */}
        <ContestSection />

        {/* Stats Section */}
        <StatsSection />

        <Footer />
      </ParallaxHero>
    </main>
  );
}
