import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 to-accent/10 border-y border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Bạn là một nghệ nhân?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Chia sẻ kỹ năng, kinh nghiệm và tác phẩm của bạn với cộng đồng. Trở thành một phần của phong trào bảo tồn di
          sản văn hóa Việt Nam.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/artists">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Khám phá nghệ nhân
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Đăng ký làm nghệ nhân
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
