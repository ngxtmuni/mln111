"use client";

import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";

type Contest = {
  id: number;
  title: string;
  image?: string;
};

const contests: Contest[] = [
  { id: 1, title: "Cuộc thi 1" },
  { id: 2, title: "Cuộc thi 2" },
  { id: 3, title: "Cuộc thi 3" },
  { id: 4, title: "Cuộc thi 4" },
  { id: 5, title: "Cuộc thi 5" },
];

interface ContestCarouselProps {
  className?: string;
}

export default function ContestCarousel({ className }: ContestCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    dragFree: true,
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
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
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onScroll = useCallback((emblaApi: any) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    onScroll(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);
  }, [emblaApi, onSelect, onScroll]);

  return (
    <section className={`relative py-20 overflow-hidden ${className || ""}`}>
      {/* Vertical Grid Lines Background */}
      <div className="absolute inset-0 flex justify-between pointer-events-none opacity-10">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-px h-full" />
        ))}
      </div>

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="flex flex-col gap-12">
          {/* Carousel */}
          <div className="w-full">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex -ml-4">
                {contests.map((contest, index) => (
                  <div
                    key={contest.id}
                    className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4 min-w-0"
                  >
                    <div className="bg-[#EEF2FF] aspect-3/5 rounded-sm relative group cursor-pointer overflow-hidden transition-transform hover:-translate-y-2 duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-8 mt-12">
              <div className="flex gap-4">
                <button
                  onClick={scrollPrev}
                  disabled={prevBtnDisabled}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={nextBtnDisabled}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 h-px bg-white/20 relative">
                <div
                  className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
