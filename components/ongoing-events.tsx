export default function OngoingEvents() {
  const events = [
    {
      id: 1,
      title: "Lễ hội Tết Nguyên Đán 2025",
      date: "29/01 - 02/02/2025",
      location: "Hà Nội",
      image: "/placeholder.svg?key=event1",
      participants: 1200,
    },
    {
      id: 2,
      title: "Triển lãm Tranh Đông Hồ",
      date: "15/02 - 28/02/2025",
      location: "TP. Hồ Chí Minh",
      image: "/placeholder.svg?key=event2",
      participants: 850,
    },
    {
      id: 3,
      title: "Workshop Nhạc cụ Truyền thống",
      date: "01/03 - 31/03/2025",
      location: "Huế",
      image: "/placeholder.svg?key=event3",
      participants: 450,
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-primary mb-12">Sự kiện đang diễn ra</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Hình ảnh sự kiện</p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">📅 {event.date}</p>
                <p className="text-sm text-muted-foreground mb-4">📍 {event.location}</p>
                <p className="text-sm font-semibold text-accent">{event.participants} người tham gia</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
