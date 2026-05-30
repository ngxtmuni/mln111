"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import TrueFocus from "@/components/TrueFocus";

export function ContestSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative min-h-dvh bg-black flex items-center mb-32"
      style={{ willChange: "transform" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
        className="w-full grid md:grid-cols-3 grid-cols-1 md:h-[100dvh]"
      >
        <div className="bg-[#6F70BE] col-span-1 text-[#E0E7FF] flex flex-col items-center justify-center text-center gap-8 px-4 py-16 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-[6.5rem] font-extrabold leading-none whitespace-nowrap"
          >
            <TrueFocus
              sentence="CĂN SỐ"
              manualMode={false}
              blurAmount={3}
              borderColor="#E0E7FF"
              animationDuration={1.5}
              pauseBetweenAnimations={1}
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-base md:text-lg font-medium italic"
          >
            Hãy để tác phẩm của bạn trở thành mảnh ghép mới trong bức tranh di
            sản đương đại
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/contests">
              <button className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white font-bold px-10 py-3 rounded-full cursor-pointer transition-all shadow-lg">
                Tham gia ngay
              </button>
            </Link>
          </motion.div>
        </div>
        <div className="col-span-1 relative min-h-[400px] md:min-h-0 overflow-hidden">
          <Image
            src="/poster.png"
            alt="Poster Cuộc thi Căn số"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="col-span-1 bg-[#BEBEFF] text-[#393ADD] flex flex-col items-start justify-center py-16 md:py-0">
          <Link href="/contests">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-[5.4vw] font-extrabold [text-shadow:3px_3px_0px_rgba(0,0,0,0.15)] cursor-pointer hover:opacity-80 transition-opacity leading-[1.2] text-left px-6 md:px-12"
            >
              <span className="block whitespace-nowrap">CUỘC THI</span>
              <span className="block whitespace-nowrap">SÁNG TẠO</span>
              <span className="block whitespace-nowrap">NGHỆ</span>
              <span className="block whitespace-nowrap">THUẬT</span>
            </motion.h2>
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}
