"use client"

interface TimelineItem {
  name: string;
}

interface VerticalTimelineProps {
  items: TimelineItem[];
}

export default function VerticalTimeline({ items }: VerticalTimelineProps) {
  return (
    <div className="relative max-w-md mx-auto">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-400" />
      {items.map((item, index) => (
        <div key={index} className="relative py-4">
          <div className="relative text-center">
            <span className="bg-black px-4 text-lg font-bold text-white relative z-10">
              {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
