"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

const STORAGE_KEY = "hideEventPopup-canso-message"

export default function EventPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldHideNextTime, setShouldHideNextTime] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (localStorage.getItem(STORAGE_KEY) === "true") return

    const timer = window.setTimeout(() => {
      setIsOpen(true)
    }, 500)

    return () => window.clearTimeout(timer)
  }, [])

  const closePopup = useMemo(
    () => () => {
      setIsOpen(false)
      if (typeof window !== "undefined" && shouldHideNextTime) {
        localStorage.setItem(STORAGE_KEY, "true")
      }
    },
    [shouldHideNextTime]
  )

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.35 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-8 text-center shadow-[0_18px_80px_rgba(0,0,0,0.45)]"
          >
            <button
              type="button"
              onClick={closePopup}
              aria-label="Đóng popup"
              className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-4 inline-flex rounded-full border border-[#393ADD]/30 bg-[#393ADD]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#9091FF]">
              Triển lãm Căn Số
            </div>

            <h2 className="mb-4 text-3xl font-black uppercase tracking-[0.12em] text-white md:text-4xl">
              Căn số của bạn là gì?
            </h2>

            <p className="mx-auto mb-8 max-w-sm text-sm leading-7 text-zinc-300 md:text-base">
              Mở phần nhập số để khám phá lời nhắn dành riêng cho bạn tại triển lãm.
            </p>

            <label className="mb-5 flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05]">
              <input
                type="checkbox"
                checked={shouldHideNextTime}
                onChange={(event) => setShouldHideNextTime(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-transparent accent-[#393ADD]"
              />
              <span className="font-medium">Ẩn popup này, tôi không quan tâm lúc này</span>
            </label>

            <div className="flex flex-col gap-3">
              <Link
                href="/exhibition/canso/thong-diep"
                className="w-full rounded-xl bg-[#393ADD] px-4 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#3031BA] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[0_10px_35px_rgba(57,58,221,0.28)]"
              >
                Mở ngay
              </Link>

              <button
                type="button"
                onClick={closePopup}
                className="w-full rounded-xl border border-white/10 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-white/5"
              >
                Để sau
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
