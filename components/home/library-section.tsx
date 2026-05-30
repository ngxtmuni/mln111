"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function LibrarySection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.1 }}
      className="relative py-20 px-4 md:px-12 bg-black min-h-dvh md:h-dvh"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center text-white mb-2"
        >
          THƯ VIỆN
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl text-center mb-16 text-gray-400"
        >
          (Sắp ra mắt)
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative aspect-[3/4] cursor-pointer group z-10"
          >
            <Image
              src="/khong-gian-thieng.png"
              alt="Thư viện Thánh nhân"
              fill
              className="object-cover object-bottom rounded-2xl scale-75 origin-bottom"
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 400"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M24 1 H276 Q299 1 299 24 V307 Q299 331 275 331 H248 Q224 331 224 355 V375 Q224 399 200 399 H24 Q1 399 1 376 V24 Q1 1 24 1Z"
                stroke="rgba(113,113,122,0.7)"
                strokeWidth="1"
                fill="transparent"
                className="group-hover:stroke-zinc-500 transition-colors"
              />
            </svg>
            <div className="absolute bottom-2 left-12 right-4 p-4">
              <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between">
                <span className="text-primary font-medium">Thư viện số hóa</span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.05,
              y: -10,
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative aspect-[3/4] cursor-pointer group z-10"
          >
            <Image
              src="/thu-vien-chau-van.png"
              alt="Thư viện Chầu văn"
              fill
              className="object-cover object-bottom rounded-2xl scale-75 origin-bottom"
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 400"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M24 69 H52 Q76 69 76 45 V25 Q76 1 100 1 H276 Q299 1 299 24 V376 Q299 399 276 399 H24 Q1 399 1 376 V93 Q1 69 24 69Z"
                stroke="rgba(113,113,122,0.7)"
                strokeWidth="1"
                fill="transparent"
                className="group-hover:stroke-zinc-500 transition-colors"
              />
            </svg>
            <div className="absolute top-2 left-4 right-12 p-4">
              <div className="bg-white rounded-full px-4 py-2 flex items-center justify-between">
                <span className="text-primary font-medium">Chầu văn</span>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7v10"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/library">
            <button className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white font-bold px-10 py-3 rounded-full cursor-pointer transition-all shadow-lg">
              Xem thêm
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
