import { Button } from "@/components/ui/button"

export default function FeaturedArtists() {
  const artists = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      specialty: "Tranh Đông Hồ",
      image: "/placeholder.svg?key=feat1",
      followers: 1234,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Trần Thị B",
      specialty: "Nhạc cụ truyền thống",
      image: "/placeholder.svg?key=feat2",
      followers: 856,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Lê Văn C",
      specialty: "Kiến trúc cổ",
      image: "/placeholder.svg?key=feat3",
      followers: 567,
      rating: 4.7,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      specialty: "Gốm sứ truyền thống",
      image: "/placeholder.svg?key=feat4",
      followers: 723,
      rating: 4.9,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12">Nghệ nhân cộng đồng tiêu biểu</h2>
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Ảnh nghệ nhân</p>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">{artist.name}</h3>
                <p className="text-sm text-accent mb-3">{artist.specialty}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">⭐ {artist.rating}</span>
                  <span className="text-sm text-muted-foreground">{artist.followers} theo dõi</span>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Xem hồ sơ
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Khám phá tất cả nghệ nhân
          </Button>
        </div>
      </div>
    </section>
  )
}
