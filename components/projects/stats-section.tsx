"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/count-up";
import { GradientStatCard } from "@/components/gradient-stat-card";

const statsData = [
  {
    value: (
      <>
        <CountUp
          from={0}
          to={100000}
          separator=","
          direction="up"
          duration={1}
        />
        {" +"}
      </>
    ),
    label: "lượt tương tác và tiếp cận trực tuyến",
  },
  {
    value: (
      <>
        <CountUp from={0} to={500} separator="," direction="up" duration={1} />
        {" +"}
      </>
    ),
    label: "người tham gia vào cộng đồng trẻ yêu văn hóa Việt",
  },
];

export function StatsSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-black">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-12"
        >
          Những con số nổi bật
        </motion.h2>

        <div className="bg-[#393ADD]/60 py-12 md:py-24 px-6 md:px-12 rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {statsData.map((stat, index) => (
              <GradientStatCard
                key={index}
                value={stat.value}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
