"use client"

import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function FavoritesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-primary/10 p-6 rounded-full mb-6"
      >
        <Heart className="w-16 h-16 text-primary" />
      </motion.div>
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-4"
      >
        Yêu thích
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground max-w-md text-lg"
      >
        Tính năng lưu trữ các nội dung yêu thích đang được phát triển và sẽ sớm ra mắt.
        <br />
        Hãy quay lại sau nhé!
      </motion.p>
    </div>
  )
}
