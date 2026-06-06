"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PhilosophySection() {
  const [openCards, setOpenCards] = useState<{ [key: string]: boolean }>({
    nhacPhu: false,
    thoaiPhu: false,
    diaPhu: false,
  });

  const toggleCard = (cardId: string) => {
    setOpenCards((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };

  return (
    <section
      id="triet-hoc"
      className="py-32 px-4 md:px-12 bg-zinc-950 space-y-40 text-white font-sans"
    >
      <div className="container mx-auto max-w-6xl">
        {/* MỞ ĐẦU SECTION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-24 max-w-3xl"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold block mb-3">
            Hệ Thống Quan Niệm Bản Địa
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            LIÊN HỆ VỚI TRIẾT HỌC
          </h2>
          <div className="h-1 w-24 bg-[#393ADD] mt-4 mb-6" />
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed text-justify">
            Liên hệ với triết học, đạo thờ Mẫu có thể hiểu không chỉ là một tín
            ngưỡng dân gian, mà còn chứa đựng một hệ quan niệm về con người, tự
            nhiên, xã hội và cái thiêng trong đời sống người Việt.
          </p>
        </motion.div>

        <div className="space-y-44">
          {/* LÝ LUẬN 1: TƯ TƯỞNG CON NGƯỜI SỐNG HÀI HÒA VỚI THIÊN NHIÊN */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-zinc-100">
                Tư tưởng con người sống hài hòa với thiên nhiên
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Hệ thống vũ trụ luận dân gian
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* THẺ 1: NÚI RỪNG */}
              <div
                onClick={() => toggleCard("nhacPhu")}
                className={`relative h-[360px] rounded-2xl overflow-hidden border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-500 ${
                  openCards.nhacPhu
                    ? "border-[#393ADD] bg-zinc-900/60"
                    : "border-zinc-900 bg-zinc-900/20 hover:border-zinc-800"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-[url('/phong-canh-nui.png')] bg-cover bg-center transition-all duration-500 pointer-events-none ${
                    openCards.nhacPhu
                      ? "opacity-10 mix-blend-luminosity"
                      : "opacity-40"
                  }`}
                />

                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-bold text-[#393ADD] tracking-widest uppercase block">
                    Nhạc Phủ
                  </span>

                  <AnimatePresence mode="wait">
                    {openCards.nhacPhu && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="text-zinc-300 text-xs md:text-sm leading-relaxed text-justify"
                      >
                        Đại diện bởi miền rừng núi (Mẫu Thượng Ngàn). Việc tôn
                        thờ không gian này cho thấy người Việt cổ nhìn nhận tự
                        nhiên như một chỉnh thể sống động, có linh hồn và ẩn
                        chứa sức mạnh chở che, nuôi dưỡng con người qua bao thế
                        hệ.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <span
                  className={`text-lg font-bold tracking-wide relative z-10 transition-colors duration-300 ${
                    openCards.nhacPhu ? "text-[#393ADD]" : "text-zinc-400"
                  }`}
                >
                  NÚI RỪNG
                </span>
              </div>

              {/* THẺ 2: SÔNG NƯỚC */}
              <div
                onClick={() => toggleCard("thoaiPhu")}
                className={`relative h-[360px] rounded-2xl overflow-hidden border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-500 ${
                  openCards.thoaiPhu
                    ? "border-[#393ADD] bg-zinc-900/60"
                    : "border-zinc-900 bg-zinc-900/20 hover:border-zinc-800"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-[url('/phong-canh-song.jpg')] bg-cover bg-center transition-all duration-500 pointer-events-none ${
                    openCards.thoaiPhu
                      ? "opacity-10 mix-blend-luminosity"
                      : "opacity-40"
                  }`}
                />

                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-bold text-[#393ADD] tracking-widest uppercase block">
                    Thoải Phủ
                  </span>

                  <AnimatePresence mode="wait">
                    {openCards.thoaiPhu && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="text-zinc-300 text-xs md:text-sm leading-relaxed text-justify"
                      >
                        Gắn liền với miền sông nước (Mẫu Thoải). Trong tư duy
                        triết học vũ trụ luận dân gian, nguồn nước không chỉ
                        phục vụ nền văn minh lúa nước mà còn là biểu tượng của
                        sự gột rửa, tái sinh và dòng chảy sinh mệnh tuần hoàn.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <span
                  className={`text-lg font-bold tracking-wide relative z-10 transition-colors duration-300 ${
                    openCards.thoaiPhu ? "text-[#393ADD]" : "text-zinc-400"
                  }`}
                >
                  SÔNG NƯỚC
                </span>
              </div>

              {/* THẺ 3: LÀNG QUÊ / ĐẤT ĐAI */}
              <div
                onClick={() => toggleCard("diaPhu")}
                className={`relative h-[360px] rounded-2xl overflow-hidden border p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-500 ${
                  openCards.diaPhu
                    ? "border-[#393ADD] bg-zinc-900/60"
                    : "border-zinc-900 bg-zinc-900/20 hover:border-zinc-800"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-[url('/phong-canh-lang-que.jpg')] bg-cover bg-center transition-all duration-500 pointer-events-none ${
                    openCards.diaPhu
                      ? "opacity-10 mix-blend-luminosity"
                      : "opacity-40"
                  }`}
                />

                <div className="relative z-10 space-y-3">
                  <span className="text-xs font-bold text-[#393ADD] tracking-widest uppercase block">
                    Địa Phủ / Thiên Phủ
                  </span>

                  <AnimatePresence mode="wait">
                    {openCards.diaPhu && (
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                        className="text-zinc-300 text-xs md:text-sm leading-relaxed text-justify"
                      >
                        Gắn liền với đất đai và vòm trời. Đây là lời khẳng định
                        con người không tách rời thế giới tự nhiên, tồn tại
                        trong mối quan hệ phụ thuộc lẫn nhau, từ đó hình thành
                        nên thái độ sống biết ơn, ứng xử hài hòa và tôn trọng
                        môi trường.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <span
                  className={`text-lg font-bold tracking-wide relative z-10 transition-colors duration-300 ${
                    openCards.diaPhu ? "text-[#393ADD]" : "text-zinc-400"
                  }`}
                >
                  LÀNG QUÊ / ĐẤT ĐAI
                </span>
              </div>
            </div>
          </motion.div>

          {/* LÝ LUẬN 2: ĐỀ CAO NGUYÊN LÝ MẸ */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/20 flex flex-col justify-center">
              <span className="text-xs font-bold text-[#393ADD] uppercase tracking-widest block mb-2">
                Triết lý nhân sinh bản địa
              </span>
              <h3 className="text-xl md:text-3xl font-bold text-white leading-tight">
                Đề cao nguyên lý Mẹ
              </h3>
              <div className="h-1 w-12 bg-zinc-700 mt-4" />
            </div>

            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/30 flex items-center">
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed text-justify">
                Trong many tôn giáo hoặc hệ tư tưởng, hình ảnh nam thần, vua
                trời, đấng cha thường giữ vai trò trung tâm. Nhưng trong đạo Mẫu
                Việt Nam, hình tượng người Mẹ thiêng liêng lại giữ vị trí rất
                quan trọng.
              </p>
            </div>

            <div className="relative h-[280px] rounded-2xl overflow-hidden border border-zinc-900">
              <div className="absolute inset-0 bg-[url('/hinh-thanh-mau.png')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h4 className="text-base font-bold text-white">
                  Hình Thánh Mẹ
                </h4>
              </div>
            </div>

            <div className="p-8 rounded-2xl border border-zinc-900 bg-zinc-900/30 flex items-center">
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed text-justify">
                Điều này phản ánh một triết lý nhân sinh sâu sắc: sự sống bắt
                nguồn từ Mẹ, con người cần được bảo bọc, yêu thương và tái sinh
                cả về vật chất lẫn tinh thần. Khẳng định phái tính nữ là ngọn
                nguồn sinh thành thiêng liêng.
              </p>
            </div>
          </motion.div>

          {/* LÝ LUẬN 3: QUAN NIỆM ÂM - DƯƠNG CÂN BẰNG */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#393ADD] uppercase tracking-widest block mb-2">
                  Quy luật thống nhất mặt đối lập
                </span>
                <h3 className="text-xl md:text-3xl font-bold text-white">
                  Quan niệm âm - dương cân bằng
                </h3>
                <div className="h-1 w-12 bg-zinc-700 mt-4" />
              </div>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed text-justify">
                Mẫu đại diện cho yếu tố âm, mềm mại, bao dung, sinh sản, nuôi
                dưỡng; nhưng không yếu đuối. Các vị Mẫu vừa dịu dàng vừa quyền
                năng, vừa là mẹ vừa là thần linh bảo vệ quốc gia, cộng đồng và
                cá nhân. Vì vậy, đạo Mẫu không xem nữ tính là thấp kém, mà coi
                nữ tính là một nguồn sức mạnh thiêng liêng.
              </p>
            </div>

            <div className="relative h-[380px] rounded-3xl overflow-hidden border border-zinc-900">
              <div className="absolute inset-0 bg-[url('/yin-yang.png')] bg-cover bg-center opacity-35 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-sm text-zinc-400">
                  Hình ảnh biểu hiện sự cân bằng của vũ trụ
                </p>
              </div>
            </div>
          </motion.div>

          {/* LÝ LUẬN 4: TRIẾT LÝ NHẬP THẾ & UỐNG NƯỚC NHỚ NGUỒN */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="max-w-3xl space-y-4">
              <div>
                <span className="text-xs font-bold text-[#393ADD] uppercase tracking-widest block mb-2">
                  Ý thức xã hội hiện sinh
                </span>
                <h3 className="text-xl md:text-3xl font-bold text-white">
                  Triết lý nhập thế & Uống nước nhớ nguồn
                </h3>
                <div className="h-1 w-12 bg-zinc-700 mt-3" />
              </div>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed text-justify">
                Nhiều tôn giáo hướng con người đến thế giới sau khi chết hoặc sự
                giải thoát khỏi đời sống hiện thực. Còn đạo Mẫu quan tâm đến đời
                sống cụ thể: sức khỏe, bình an, làm ăn, mùa màng. Đồng thời, đức
                tin này lồng ghép sâu sắc quan niệm{" "}
                <strong className="text-white">uống nước nhớ nguồn</strong>.
                Nhiều nhân vật được thờ trong hệ thống đạo Mẫu không chỉ là thần
                linh tự nhiên mà còn gắn với lịch sử, có công bảo vệ dân tộc, mở
                đất, giúp dân. Nó kết hợp nhuần nhuyễn giữa thờ thần, thờ Mẹ và
                thờ anh hùng dân tộc, thể hiện ý thức cộng đồng hướng tới cuộc
                sống thực tại.
              </p>
            </div>

            <div className="relative h-[340px] w-full rounded-3xl overflow-hidden border border-zinc-900">
              <div className="absolute inset-0 bg-[url('/nong-dan-lao-dong.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h4 className="text-lg font-bold text-white">
                  Người dân làm đồng
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Sự gắn bó với đời sống trần gian và lịch sử lao động sản xuất
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
