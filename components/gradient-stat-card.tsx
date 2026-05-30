"use client";

import { motion } from "framer-motion";

interface GradientStatCardProps {
  value: string | React.ReactNode;
  label: string;
  index?: number;
}

export function GradientStatCard({
  value,
  label,
  index = 0,
}: GradientStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="bg-[#EEF2FF] rounded-2xl p-8 h-full text-center shadow-lg"
    >
      <div className="text-4xl md:text-5xl font-bold text-[#393ADD] mb-3">
        {value}
      </div>
      <p className="text-gray-800 text-sm md:text-base">{label}</p>
    </motion.div>
  );
}
