"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Orb = dynamic(() => import("@/components/Orb"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-transparent" />,
});

export function ChatboxSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative min-h-[50dvh] md:h-dvh flex items-center justify-center overflow-hidden mt-20 md:mt-60 bg-black"
    >
      {/* Centered Wrapper for both Orb and Content */}
      <div className="relative w-full h-full">
        {/* Orb behind - Fixed size and perfectly centered using absolute positioning */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[300px] h-[300px] md:w-[1000px] md:h-[1000px]">
          <div className="w-full h-full pointer-events-auto">
            <Orb
              hue={222}
              hoverIntensity={0.8}
              rotateOnHover
              forceHoverState={false}
            />
          </div>
        </div>

        {/* Text Content in front - Centered via flex in parent */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="container mx-auto max-w-5xl text-center relative z-10 px-4">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white font-bold text-xl mb-4"
            >
              Chatbox AI
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <h2 className="text-4xl md:text-8xl font-black leading-tight text-[#393ADD] uppercase">
                Trò Chuyện <br /> Cùng Nghệ Nhân
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-white italic text-lg mb-12"
            >
              (Sắp ra mắt)
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <button className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white font-bold px-10 py-4 rounded-full transition-all text-xl pointer-events-auto shadow-[0_0_20px_rgba(57,58,221,0.4)] border-2 border-white/10">
                Khám Phá
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
