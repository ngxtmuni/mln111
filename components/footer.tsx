"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black via-primary/10 via-35% to-primary/45 py-12 px-4 border-t border-zinc-900 font-sans">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Cột trái: Đội ngũ thực hiện */}
          <div className="space-y-6 max-w-xl">
            <div>
              <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Đội ngũ thực hiện
              </h4>

              <div className="flex flex-col divide-y divide-zinc-900 border-y border-zinc-900 text-sm">
                {/* Nguyễn Thế Minh */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-white font-medium">
                    Nguyễn Thế Minh
                  </span>
                  <span className="text-xs text-zinc-400 sm:text-right">
                    Biên tập nội dung & Xây dựng hệ thống
                  </span>
                </div>

                {/* Nguyễn Tuấn Anh */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-white font-medium">
                    Nguyễn Tuấn Anh
                  </span>
                  <span className="text-xs text-zinc-400 sm:text-right">
                    Phát triển nội dung & Thiết kế giao diện
                  </span>
                </div>

                {/* Hà Nguyễn Đắc Bình */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-white font-medium">
                    Hà Nguyễn Đắc Bình
                  </span>
                  <span className="text-xs text-zinc-400 sm:text-right">
                    Tích hợp công nghệ AI & Kỹ thuật số
                  </span>
                </div>

                {/* Phạm Lê Gia Hân */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-white font-medium">
                    Phạm Lê Gia Hân
                  </span>
                  <span className="text-xs text-zinc-500 sm:text-right">
                    Hỗ trợ xây dựng hệ thống & Thu thập tư liệu
                  </span>
                </div>

                {/* Nguyễn Nhật Thông */}
                <div className="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-white font-medium">
                    Nguyễn Nhật Thông
                  </span>
                  <span className="text-xs text-zinc-500 sm:text-right">
                    Hỗ trợ thiết kế giao diện & Thu thập tư liệu
                  </span>
                </div>
              </div>
            </div>

            {/* Công nghệ hỗ trợ */}
            <div className="flex flex-col gap-2 pt-1 text-zinc-400 text-xs">
              <span>Sản phẩm ứng dụng công nghệ trí tuệ nhân tạo từ</span>
              <div className="flex items-center gap-3">
                <img
                  src="/ChatGPT_logo.svg"
                  alt="ChatGPT"
                  title="ChatGPT"
                  className="h-5 w-auto object-contain brightness-75 hover:brightness-100 transition-all cursor-help"
                />
                <img
                  src="/Google-gemini-icon.svg.png"
                  alt="Gemini"
                  title="Gemini"
                  className="h-5 w-auto object-contain brightness-75 hover:brightness-100 transition-all cursor-help"
                />
              </div>
            </div>
          </div>

          {/* Cột phải: Thông tin quản lý */}
          <div className="space-y-6 md:text-right flex flex-col md:items-end justify-start max-w-xs">
            <div>
              <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4">
                Thông tin dự án
              </h4>

              <div className="flex flex-col gap-3 text-sm">
                {/* Trưởng nhóm */}
                <div className="mb-3">
                  <span className="text-zinc-500 block text-xs">
                    Trưởng nhóm dự án
                  </span>
                  <strong className="text-white font-semibold text-base mt-0.5 block">
                    Nguyễn Thế Minh
                  </strong>
                </div>

                <div className="mb-3">
                  <span className="text-zinc-500 block text-xs">
                    Đơn vị học tập
                  </span>
                  <span className="text-zinc-300 font-medium mt-0.5 block">
                    Trường Đại học FPT — Nhóm 9
                  </span>
                </div>

                {/* Thời gian */}
                <div className="mb-3">
                  <span className="text-zinc-500 block text-xs">
                    Thời gian hoàn thành
                  </span>
                  <span className="text-zinc-400 text-xs mt-0.5 block">
                    Học kỳ Summer 2026
                  </span>
                </div>
              </div>

              {/* <div className="mb-3">
                <p className="text-white text-sm mt-1">
                  <span className="font-semibold">Email: </span>
                  <span>contact@example.com</span>
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
