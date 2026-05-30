"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function MissionSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative py-12 bg-black rounded-t-[48px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="md:col-span-5 px-6 md:px-12 text-center"
        >
          <h2 className="text-3xl md:text-6xl font-bold pb-6 text-[#393ADD]">
            Sứ Mệnh
          </h2>
          <p className="text-base text-gray-400 leading-relaxed">
            Với sứ mệnh trở thành một nền tảng tiên phong trong việc cam kết bảo
            tồn và lan tỏa những giá trị di sản của Tín ngưỡng Thờ Mẫu Tam Phủ
            trong đời sống đương đại. Thông qua việc thực hiện số hóa lưu giữ để
            bảo tồn những giá trị nguyên bản, tạo nên một kho tàng văn hóa sống
            động, đồng thời kết nối những trái tim yêu văn hóa, nuôi dưỡng lòng
            tự hào và trách nhiệm bảo vệ hồn cốt dân tộc. Mỗi một hành động ngày
            hôm nay đều hướng tới việc nối dài dòng chảy di sản của Việt Nam cho
            muôn đời sau.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative md:col-span-7 h-[60dvh] md:h-[70dvh] overflow-hidden rounded-l-3xl"
        >
          <Image
            src="/image1-home.png"
            alt="Sứ Mệnh"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
