"use client";

import { motion } from "framer-motion";

export interface RegionItem {
  label: string;
  title: string;
  description: string;
}

interface RegionTimelineProps {
  regions: RegionItem[];
}

const cardColors = ["#EEF2FF", "#C7D2FE", "#818CF8"];

export function RegionTimeline({ regions }: RegionTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical timeline line - continuous from top to bottom */}
      <div className="absolute left-1.5 top-1.5 bottom-1.5 w-px bg-zinc-500 hidden md:block" />

      <div className="space-y-6">
        {regions.map((region, index) => (
          <motion.div
            key={region.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 md:gap-8"
          >
            {/* Left: Label with dot */}
            <div className="relative flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-primary shrink-0 z-10" />
              <span className="text-white font-medium whitespace-nowrap">
                {region.label}
              </span>
            </div>

            {/* Right: Content card */}
            <div
              className="rounded-lg p-6 md:p-8"
              style={{ backgroundColor: cardColors[index] || cardColors[0] }}
            >
              <h4 className="text-[#1E1F8C] font-semibold text-lg mb-4">
                {region.title}
              </h4>

              <p className="text-[#1E1F8C] text-sm leading-relaxed">
                {region.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
