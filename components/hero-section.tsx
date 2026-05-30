import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 md:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">Bảo tồn di sản</p>
              <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">Thờ Mẫu Tam – Tứ Phủ</h1>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Nền tảng kỹ thuật số dành cho bảo tồn, chia sẻ và phát triển di sản văn hóa Việt Nam. Kết nối cộng đồng
              những người yêu thích văn hóa truyền thống.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/projects">
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Khám phá dự án
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Tham gia cộng đồng
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Dự án</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Thành viên</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Nghệ nhân</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden bg-muted">
            <img
              src="/vietnamese-cultural-heritage-temple-architecture-t.jpg"
              alt="Di sản văn hóa Việt Nam"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
