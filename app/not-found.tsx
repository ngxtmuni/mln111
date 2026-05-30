import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(57,58,221,0.24),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-88px)] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#7c7df6] backdrop-blur-md">
          Error 404
        </div>

        <p className="mb-4 text-[5rem] font-black leading-none text-white md:text-[8rem]">
          404
        </p>

        <h1 className="max-w-3xl text-3xl font-black uppercase tracking-[0.14em] leading-[1.35] text-[#dfe0ff] md:text-5xl md:leading-[1.25]">
          Trang bạn tìm không tồn tại
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg">
          Có thể liên kết đã sai, trang đã được di chuyển hoặc địa chỉ URL không còn hợp lệ.
          Bạn có thể quay về các khu vực chính của nền tảng từ đây.
        </p>

        <div className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-2xl bg-[#393ADD] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#3031BA]"
          >
            Về trang chủ
          </Link>
          <Link
            href="/events"
            className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
          >
            Xem sự kiện
          </Link>
          <Link
            href="/library"
            className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
          >
            Mở thư viện
          </Link>
        </div>

        <div className="mt-14 grid w-full max-w-4xl gap-4 text-left md:grid-cols-3">
          <Link
            href="/exhibition/canso"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-transform hover:-translate-y-1 hover:bg-white/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7c7df6]">Exhibition</p>
            <p className="mt-3 text-xl font-bold text-white">Triển lãm Căn Số</p>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Tiếp tục hành trình tương tác, check-in và nhận thông điệp của bạn.
            </p>
          </Link>

          <Link
            href="/contests"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-transform hover:-translate-y-1 hover:bg-white/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7c7df6]">Contest</p>
            <p className="mt-3 text-xl font-bold text-white">Cuộc thi</p>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Khám phá các cuộc thi đang mở, thể lệ và tác phẩm nổi bật.
            </p>
          </Link>

          <Link
            href="/news"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-transform hover:-translate-y-1 hover:bg-white/10"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7c7df6]">News</p>
            <p className="mt-3 text-xl font-bold text-white">Tin tức</p>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Theo dõi các cập nhật mới nhất về dự án, hoạt động và cộng đồng.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
