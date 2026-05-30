import { Button } from "@/components/ui/button"

export default function ContestsCTA() {
  const contests = [
    {
      id: 1,
      title: "Cuộc thi vẽ tranh Đông Hồ",
      prize: "5 triệu đồng",
      endDate: "31/01/2025",
      participants: 156,
    },
    {
      id: 2,
      title: "Cuộc thi sáng tác nhạc dân tộc",
      prize: "10 triệu đồng",
      endDate: "28/02/2025",
      participants: 89,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary/80 via-pink-400 to-cyan-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">Cuộc thi đang diễn ra</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contests.map((contest) => (
            <div key={contest.id} className="bg-white/95 rounded-lg p-6 backdrop-blur">
              <h3 className="text-2xl font-bold text-primary mb-4">{contest.title}</h3>
              <div className="space-y-3 mb-6">
                <p className="text-lg">
                  <span className="font-semibold text-accent">Giải thưởng:</span> {contest.prize}
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-accent">Hạn chót:</span> {contest.endDate}
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-accent">Thí sinh:</span> {contest.participants} người
                </p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Tham gia ngay</Button>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 bg-transparent">
            Xem tất cả cuộc thi
          </Button>
        </div>
      </div>
    </section>
  )
}
