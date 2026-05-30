"use client";

import { motion } from "framer-motion";
import { Share, PlusSquare, MoreVertical, Smartphone, MonitorSmartphone, QrCode, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DownloadPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#393ADD]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-4 bg-[#393ADD]/20 rounded-2xl mb-6">
            <Smartphone className="w-10 h-10 text-[#393ADD]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Tải Ứng Dụng Nghệ Nhân
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Trang cài đặt ứng dụng nội bộ dành riêng cho Nghệ nhân và Ban Quản trị. Dễ dàng cài đặt trực tiếp trên điện thoại mà không cần qua App Store hay Google Play.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* iOS Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM15.1834 16.32L12 14.8V8H13.6V13.68L15.9324 14.9099L15.1834 16.32Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Dành cho iOS (iPhone)</h2>
                <p className="text-sm text-gray-400">Yêu cầu trình duyệt Safari</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#393ADD] flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <p className="font-medium text-lg mb-1">Mở trang này trên Safari</p>
                  <p className="text-gray-400 text-sm">Nếu bạn đang mở qua Zalo/Facebook, hãy chọn "Mở bằng trình duyệt Safari".</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#393ADD] flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <p className="font-medium text-lg mb-1 flex items-center gap-2">
                    Nhấn nút Chia sẻ (Share) 
                    <Share className="w-4 h-4 text-[#393ADD]" />
                  </p>
                  <p className="text-gray-400 text-sm">Nút này nằm ở thanh công cụ dưới cùng của màn hình.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#393ADD] flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                  <p className="font-medium text-lg mb-1 flex items-center gap-2">
                    Chọn "Thêm vào MH chính" 
                    <PlusSquare className="w-4 h-4 text-[#393ADD]" />
                  </p>
                  <p className="text-gray-400 text-sm">Trong tiếng Anh là "Add to Home Screen".</p>
                </div>
              </div>
            </div>

            <Link href="https://app.thomautamphu.vn" target="_blank" className="mt-8 p-4 bg-white/5 rounded-2xl flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
              <span className="font-medium mr-2">🔗 Mở ứng dụng ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Android Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 pt-8 mt-12 md:mt-0 relative"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#3DDC84]/20 flex items-center justify-center shrink-0">
                <MonitorSmartphone className="w-6 h-6 text-[#3DDC84]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Dành cho Android</h2>
                <p className="text-sm text-gray-400">Yêu cầu Google Chrome</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#3DDC84] text-black flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <p className="font-medium text-lg mb-1">Mở trang này bằng Chrome</p>
                  <p className="text-gray-400 text-sm">Đảm bảo bạn không mở trong trình duyệt nhúng của app chat.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#3DDC84] text-black flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <p className="font-medium text-lg mb-1 flex items-center gap-2">
                    Nhấn vào Nút Menu 
                    <MoreVertical className="w-4 h-4 text-[#3DDC84]" />
                  </p>
                  <p className="text-gray-400 text-sm">Biểu tượng dấu 3 chấm ở góc trên cùng bên phải màn hình.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#3DDC84] text-black flex items-center justify-center shrink-0 font-bold">3</div>
                <div>
                  <p className="font-medium text-lg mb-1">Cài đặt ứng dụng</p>
                  <p className="text-gray-400 text-sm">Chọn "Cài đặt ứng dụng" (Install App) hoặc "Thêm vào Màn hình chính".</p>
                </div>
              </div>
            </div>

            <Link href="https://app.thomautamphu.vn" target="_blank" className="mt-8 p-4 bg-[#3DDC84]/10 text-[#3DDC84] rounded-2xl flex items-center justify-center group cursor-pointer hover:bg-[#3DDC84]/20 transition-colors">
              <span className="font-medium mr-2">🔗 Mở ứng dụng ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.6 }}
           className="mt-16 text-center"
        >
          <div className="inline-block p-6 bg-white rounded-[2rem]">
            <div className="w-40 h-40 bg-white flex items-center justify-center rounded-2xl mb-4 p-2">
               <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://app.thomautamphu.vn`} 
                  alt="QR Code" 
                  width={150} 
                  height={150}
               />
            </div>
            <p className="text-black font-semibold">Quét mã để truy cập ứng dụng</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
