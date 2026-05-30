import { Calendar, Users, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Contest {
  id: number
  title: string
  description: string
  image: string
  status: "active" | "upcoming" | "ended"
  startDate: string
  endDate: string
  participants: number
  prize: string
  objectives: string[]
  categories: { title: string; description: string }[]
}

interface CommunityContestsProps {
  contests: Contest[]
}

export default function CommunityContests({ contests }: CommunityContestsProps) {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    ended: "bg-gray-100 text-gray-800",
  }

  const statusLabels = {
    active: "Đang diễn ra",
    upcoming: "Sắp tới",
    ended: "Đã kết thúc",
  }

  return (
    <div className="space-y-8"> {/* Changed from grid to space-y */}
      {contests.map((contest) => (
        <Link key={contest.id} href={`/community/contests/${contest.id}`} className="block"> {/* Make the whole card a link */}
          <div
            className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:bg-accent/5 transition-all duration-300"
          >
            <div className="grid md:grid-cols-2 gap-6"> {/* Two-column layout */}
              {/* Left Column */}
              <div className="flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={contest.image || "/placeholder.svg"}
                    alt={contest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[contest.status]}`}
                  >
                    {statusLabels[contest.status]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                    {contest.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {contest.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        {contest.startDate} - {contest.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{contest.participants} người tham gia</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy size={16} />
                      <span>Giải thưởng: {contest.prize}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-4 flex justify-start gap-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle vote logic
                      }}
                      variant="outline"
                    >
                      Tham gia bình chọn
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle join contest logic
                      }}
                    >
                      Tham gia cuộc thi
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="p-6 bg-muted/20">
                <h4 className="text-lg font-semibold text-primary mb-4">💡 Mục tiêu</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  {contest.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>

                <h4 className="text-lg font-semibold text-primary mt-6 mb-4">🖌️ Các hạng mục dự thi</h4>
                <ul className="space-y-4 text-sm">
                  {contest.categories.map((category, index) => (
                    <li key={index}>
                      <span className="font-semibold text-foreground">{category.title}:</span>
                      <span className="text-muted-foreground"> {category.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
