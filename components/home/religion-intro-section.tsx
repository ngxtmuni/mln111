"use client";

import { motion } from "framer-motion";

export function ReligionIntroSection() {
  return (
    <section className="relative py-20 px-4 md:px-12 bg-zinc-950/40 text-white border-b border-zinc-900">
      <div className="container mx-auto max-w-6xl space-y-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
        >
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-5xl font-bold text-[#393ADD] uppercase tracking-wide leading-tight">
              Tín Ngưỡng <br />
              Thờ Mẫu Việt Nam
            </h2>
            <div className="h-1 w-20 bg-[#393ADD] mt-4 block" />
          </div>
          <div className="md:col-span-7 text-justify text-zinc-300 text-base md:text-lg leading-relaxed pt-2">
            <p>
              <strong className="text-white">Tín ngưỡng thờ Mẫu</strong> là hệ
              thống tâm linh bản địa lâu đời của người Việt. Khác với nhiều tôn
              giáo hướng tới thế giới sau cái chết, thờ Mẫu tập trung hoàn toàn
              vào cuộc sống hiện sinh—cầu mong sức khỏe, tài lộc và may mắn ngay
              tại trần gian qua hình tượng người Mẹ vĩ đại.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-7 order-2 lg:order-1">
            {[
              {
                name: "Mẫu Thượng Thiên",
                domain: "Miền Trời",
                img: "/mau-thien-tien.png",
              },
              { name: "Mẫu Địa", domain: "Miền Đất", img: "/mau-dia-tien.png" },
              {
                name: "Mẫu Thoải",
                domain: "Miền Nước",
                img: "/mau-thuy-tien.png",
              },
              {
                name: "Mẫu Thượng Ngàn",
                domain: "Miền Rừng Núi",
                img: "/mau-nhac-tien.png",
              },
            ].map((mother, idx) => (
              <div
                key={idx}
                className="relative h-[280px] rounded-2xl overflow-hidden group border border-zinc-900 bg-zinc-900/50 shadow-xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${mother.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end">
                  <h4 className="text-lg font-bold text-white tracking-wide drop-shadow-md">
                    {mother.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 font-semibold uppercase tracking-wider">
                    {mother.domain}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start lg:col-span-5 order-1 lg:order-2 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-[#393ADD] uppercase tracking-wide">
              Cốt Lõi
            </h2>
            <div className="h-1 w-20 bg-[#393ADD] mt-4 block" />
            <p className="text-justify text-zinc-300 text-base md:text-lg leading-relaxed pt-2">
              Cốt lõi đức tin nằm ở hệ thống{" "}
              <strong className="text-white">Tam Phủ, Tứ Phủ</strong> đại diện
              cho bốn miền không gian của vũ trụ:{" "}
              <strong className="text-white">Mẫu Thượng Thiên</strong>,{" "}
              <strong className="text-white">Mẫu Địa</strong>,{" "}
              <strong className="text-white">Mẫu Thoải</strong>, và{" "}
              <strong className="text-white">Mẫu Thượng Ngàn</strong>. Sự tôn
              kính này thể hiện triết lý sống hòa hợp và tôn trọng thiên nhiên
              sâu sắc.
            </p>
          </div>
        </motion.div>

        <div className="relative w-full overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.45] mix-blend-luminosity pointer-events-none"
            style={{ backgroundImage: "url('/lang-que.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start py-20 px-6 md:px-12"
          >
            <div className="md:col-span-5">
              <h2 className="text-3xl md:text-5xl font-bold text-[#393ADD] uppercase tracking-wide">
                Nguồn Cội
              </h2>
              <div className="h-1 w-20 bg-[#393ADD] mt-4 block" />
            </div>
            <div className="md:col-span-7 text-justify text-zinc-300 text-base md:text-lg leading-relaxed pt-2">
              <p>
                Hệ thống thần linh của Tứ Phủ chính là sự "lịch sử hóa" các vị
                anh hùng, nghĩa sĩ ngoài đời thật có công đánh đuổi giặc ngoại
                xâm hay khai phá đất đai, dạy dân trồng lúa. Thờ phụng họ là
                cách người Việt gìn giữ đạo lý vẹn nguyên qua ngàn năm:{" "}
                <strong className="text-white">"Uống nước nhớ nguồn"</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
