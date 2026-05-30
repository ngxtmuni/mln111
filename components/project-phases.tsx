export default function ProjectPhases() {
  const phases = [
    {
      number: 1,
      title: "Khám phá",
      description: "Tìm hiểu về các di sản văn hóa Việt Nam",
      icon: "🔍",
    },
    {
      number: 2,
      title: "Học hỏi",
      description: "Tiếp cận kỹ năng từ các nghệ nhân truyền thống",
      icon: "📚",
    },
    {
      number: 3,
      title: "Sáng tạo",
      description: "Tạo ra những tác phẩm mới lấy cảm hứng từ truyền thống",
      icon: "✨",
    },
    {
      number: 4,
      title: "Chia sẻ",
      description: "Chia sẻ tác phẩm và kinh nghiệm với cộng đồng",
      icon: "🤝",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16">Giai đoạn phát triển</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-accent hidden md:block"></div>

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <div key={phase.number} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-8 md:top-6">
                  <div className="w-12 h-12 bg-background border-4 border-accent rounded-full flex items-center justify-center text-xl font-bold text-accent shadow-lg">
                    {phase.number}
                  </div>
                </div>

                {/* Content - alternating left/right on desktop */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:ml-0 md:pr-16" : "md:ml-auto md:pl-16"}`}>
                  <div className="bg-background rounded-lg p-6 border border-border hover:shadow-lg transition-shadow ml-16 md:ml-0">
                    <div className="text-4xl mb-3">{phase.icon}</div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">{phase.title}</h3>
                    <p className="text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
