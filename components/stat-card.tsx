"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  value: string | React.ReactNode;
  label: string;
  index?: number;
}

export function StatCard({ value, label, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-sm rounded-2xl p-8 border border-zinc-700/50"
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-3">
        {value}
      </div>
      <p className="text-gray-300 text-sm md:text-base">{label}</p>
    </motion.div>
  );
}
