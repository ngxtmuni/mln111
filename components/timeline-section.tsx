export default function TimelineSection() {
  const events = [
    {
      year: "2024",
      title: "Khởi động nền tảng",
      description: "Thờ Mẫu Tam – Tứ Phủ chính thức ra mắt với mục tiêu bảo tồn di sản văn hóa Việt Nam",
    },
    {
      year: "2024",
      title: "Cộng đồng 10K thành viên",
      description: "Đạt mốc 10,000 thành viên tham gia từ khắp nơi trên thế giới",
    },
    {
      year: "2025",
      title: "Mở rộng thư viện số",
      description: "Tích hợp 5,000+ tài liệu, hình ảnh, video về di sản văn hóa",
    },
    {
      year: "2025",
      title: "Chương trình AI Nghệ nhân",
      description: "Giới thiệu chatbot AI để tương tác với các nghệ nhân truyền thống",
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider mb-2">Hành trình</p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Dòng thời gian phát triển</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Từ ý tưởng đến hiện thực, chúng tôi liên tục phát triển để phục vụ cộng đồng tốt hơn
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent" />

          {/* Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div key={index} className={`flex gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                {/* Content */}
                <div className="flex-1 md:text-right">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <p className="text-accent font-semibold text-sm mb-2">{event.year}</p>
                    <h3 className="text-xl font-bold text-primary mb-2">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="hidden md:flex justify-center">
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background" />
                </div>

                {/* Spacer for mobile */}
                <div className="flex-1 md:hidden" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
