"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type EventStatus = "ended" | "open" | "upcoming";

type Event = {
  id: number;
  title: string;
  image?: string;
  slug?: string;
  status: EventStatus;
};

const events: Event[] = [
  {
    id: 1,
    title: "Dòng Chảy Di Sản",
    image: "/poster-event-1.png",
    slug: "su-kien-ra-mat-du-an-quang-ba-di-san-thuc-hanh-tin-nguong-tho-mau-tam-phu",
    status: "ended",
  },
  {
    id: 2,
    title: "Hành Trình Di Sản",
    image: "/poster-event-2.png",
    slug: "hanh-trinh-di-san",
    status: "ended",
  },
  {
    id: 3,
    title: "Triển Lãm Nghệ Thuật Căn Số",
    image: "/poster-event-3.png",
    slug: "trien-lam-nghe-thuat-can-so",
    status: "ended",
  },
];

interface EventCarouselProps {
  className?: string;
  onIndexChange?: (index: number) => void;
  onEventChange?: (event: Event) => void;
}

export default function EventCarousel({ className, onIndexChange, onEventChange }: EventCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: any) => {
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    if (onIndexChange) {
      onIndexChange(index);
    }
    if (onEventChange) {
      onEventChange(events[index]);
    }
  }, [onIndexChange, onEventChange]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const progress = ((selectedIndex + 1) / events.length) * 100;

  return (
    <div className={`relative ${className || ""}`}>
      {/* Carousel - Single Image */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {events.map((event) => (
            <div key={event.id} className="flex-[0_0_100%] min-w-0">
              <div className="bg-zinc-900 aspect-video rounded-2xl relative overflow-hidden group">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-600 text-lg">{event.title}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-8">
        <div className="flex gap-3">
          <button
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 h-px bg-white/30 relative">
          <div
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Slide Number */}
        <span className="text-white text-4xl font-bold">
          {String(selectedIndex + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export type { Event, EventStatus };
