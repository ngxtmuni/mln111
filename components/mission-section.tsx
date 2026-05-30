export default function MissionSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Mục đích & Sứ mệnh</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Thờ Mẫu Tam – Tứ Phủ là nền tảng kỹ thuật số dành cho bảo tồn, phát triển và chia sẻ di sản văn hóa Việt
              Nam.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Chúng tôi tin rằng mỗi tác phẩm, mỗi kỹ năng truyền thống đều có giá trị vô cùng quý báu. Sứ mệnh của
              chúng tôi là kết nối các nghệ nhân, nhà nghiên cứu, và những người yêu thích văn hóa để cùng nhau bảo tồn
              và phát triển di sản này cho thế hệ tương lai.
            </p>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="text-3xl font-bold text-accent mb-2">500+</div>
                <p className="text-muted-foreground">Nghệ nhân</p>
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-accent mb-2">1000+</div>
                <p className="text-muted-foreground">Tác phẩm</p>
              </div>
              <div className="flex-1">
                <div className="text-3xl font-bold text-accent mb-2">50+</div>
                <p className="text-muted-foreground">Dự án</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-96 flex items-center justify-center">
            <p className="text-muted-foreground">Hình ảnh minh họa</p>
          </div>
        </div>
      </div>
    </section>
  )
}
