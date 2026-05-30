"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface RegionTabItem {
  label: string;
  title: string;
  description: string;
}

interface TabRegionSectionProps {
  regions: RegionTabItem[];
}

export function TabRegionSection({ regions }: TabRegionSectionProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="relative">
      <div className="flex items-center gap-8 mb-8">
        {regions.map((region, index) => (
          <button
            key={region.label}
            onClick={() => setActiveTab(index)}
            className="relative flex items-center gap-3 group"
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeTab === index ? "bg-primary" : "bg-zinc-600"
              }`}
            />
            <span
              className={`font-medium transition-colors duration-300 ${
                activeTab === index ? "text-white" : "text-zinc-500"
              }`}
            >
              {region.label}
            </span>
          </button>
        ))}
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border border-zinc-700 rounded-lg p-6 md:p-8"
          >
            <h4 className="text-primary font-semibold text-lg mb-4 border-b border-primary/30 pb-3">
              {regions[activeTab].title}
            </h4>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {regions[activeTab].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
