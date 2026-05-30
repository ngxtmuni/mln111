"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Footer from "@/components/footer";
import ParallaxHero from "@/components/parallax-hero";
import EventPopup from "@/components/event-popup";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Event as CarouselEvent } from "@/components/event-carousel";

const EventCarousel = dynamic(() => import("@/components/event-carousel"));
const HeroPoster = dynamic(() =>
  import("@/components/hero-poster").then((mod) => mod.HeroPoster),
);

const MissionSection = dynamic(() =>
  import("@/components/home/mission-section").then((mod) => mod.MissionSection),
);
const LibrarySection = dynamic(() =>
  import("@/components/home/library-section").then((mod) => mod.LibrarySection),
);
const ChatboxSection = dynamic(() =>
  import("@/components/home/chatbox-section").then((mod) => mod.ChatboxSection),
);
const ContestSection = dynamic(() =>
  import("@/components/home/contest-section").then((mod) => mod.ContestSection),
);

export default function Home() {
  const [activeEvent, setActiveEvent] = useState<CarouselEvent | null>(null);

  return (
    <ParallaxHero
      title="Thờ Mẫu Tam Phủ"
      subtitle=""
      description={
        <>
          Nền tảng Kết nối Di sản kiến tạo không gian số đưa thế hệ trẻ gặp gỡ
          <br className="hidden md:block" /> tinh hoa văn hóa Việt, nơi những
          giá trị linh thiêng của dân tộc cần được bảo tồn và lan tỏa
        </>
      }
      textMainClass="text-[#393ADD]"
      imageUrl="https://i.ibb.co/TDLQVZCL/Trang-Ch-1.png"
    >
      <main className="relative min-h-screen bg-black overflow-x-hidden">
        <EventPopup />

        {/* Mission Section */}
        <MissionSection />

        {/* Hero Poster Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative py-8 bg-black rounded-t-[48px] "
        >
          <HeroPoster
            title={
              <>
                Di sản Văn hoá Phi vật thể <br /> Đại diện của nhân loại
              </>
            }
            imageUrl="/image-home.png"
            textMainClass="text-white"
            description="Thực hành tín ngưỡng thờ Mẫu Tam phủ của người Việt được UNESCO công nhận là Di sản Văn hóa Phi vật thể Đại diện của Nhân loại vào năm 2016, đây không chỉ là một cột mốc lịch sử, mà còn là lời khẳng định về giá trị độc đáo của một hệ thống niềm tin được kết tinh qua nghi lễ Hầu đồng linh thiêng, nghệ thuật diễn xướng hát Chầu Văn và hệ thống trang phục, múa dân gian đầy màu sắc. Tạo nên một bảo tàng sống, nơi các giá trị lịch sử và bản sắc văn hóa Việt được bảo tồn và lan tỏa."
            descriptionClass="text-gray-200"
          />
        </motion.section>

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

        {/* Library Section */}
        <LibrarySection />

        {/* Chatbox Section */}
        <ChatboxSection />

        {/* Contest Section */}
        <ContestSection />

        <Footer />
      </main>
    </ParallaxHero>
  );
}
