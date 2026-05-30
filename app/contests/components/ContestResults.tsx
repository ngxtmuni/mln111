"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { ChevronLeft, ChevronRight, Loader2, Star, Trophy, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const REMAINING_PAGE_SIZE = 12;

const RANK_CONFIG = [
  { rank: 1, emoji: "🥇", label: "GIẢI NHẤT", prize: "", bg: "from-yellow-400/20 to-amber-600/10", border: "border-yellow-500/60", text: "text-yellow-400" },
  { rank: 2, emoji: "🥈", label: "GIẢI NHÌ", prize: "", bg: "from-zinc-300/20 to-zinc-500/10", border: "border-zinc-400/60", text: "text-zinc-300" },
  { rank: 3, emoji: "🥉", label: "GIẢI BA", prize: "", bg: "from-amber-700/20 to-amber-900/10", border: "border-amber-600/60", text: "text-amber-500" },
  { rank: 4, emoji: "🏅", label: "KHUYẾN KHÍCH", prize: "", bg: "from-blue-500/20 to-blue-700/10", border: "border-blue-500/60", text: "text-blue-400" },
];

type PublicResultItem = {
  id?: string;
  submissionId?: string;
  entryCode?: string;
  title: string;
  thumbnailUrl?: string | null;
  voteCount?: number;
  authorName?: string;
  rank?: number;
};

type PublicResultsResponse = {
  ranked: PublicResultItem[];
  voteWinners: PublicResultItem[];
  remaining: PublicResultItem[];
  remainingPage: number;
  remainingSize: number;
  remainingTotalElements: number;
  remainingTotalPages: number;
};

export default function ContestResults({ contestId }: { contestId: string }) {
  const [data, setData] = useState<PublicResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.judging.getPublicResults(contestId, { page, size: REMAINING_PAGE_SIZE })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [contestId, page]);

  if (loading && !data) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!data || (data.ranked.length === 0 && data.voteWinners.length === 0 && data.remaining.length === 0)) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="py-12"
    >
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-2xl px-6 py-3 mb-4"
          >
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-lg">KẾT QUẢ CUỘC THI CĂN SỐ 2026</span>
            <Trophy className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <p className="text-zinc-400 text-sm">Cảm ơn tất cả các tác giả đã tham gia!</p>
        </div>

        {/* Ranked winners */}
        {data.ranked.length > 0 && (
          <div className="space-y-3 mb-10">
            {RANK_CONFIG.map((cfg, i) => {
              const winner = data.ranked.find((r) => r.rank === cfg.rank);
              if (!winner) return null;
              return (
                <motion.div
                  key={cfg.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/submissions/${winner.submissionId}`}>
                    <div className={`bg-gradient-to-r ${cfg.bg} border ${cfg.border} rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer`}>
                      <span className="text-4xl flex-shrink-0">{cfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold uppercase tracking-widest ${cfg.text} mb-0.5`}>{cfg.label}</div>
                        <div className="font-mono text-xs text-zinc-500">{winner.entryCode}</div>
                        <div className="text-white font-bold text-base line-clamp-1">{winner.title}</div>
                        <div className="text-zinc-400 text-xs mt-0.5">{winner.authorName}</div>
                        <div className="text-zinc-500 text-xs mt-1">{cfg.prize}</div>
                      </div>
                      {winner.thumbnailUrl && (
                        <div className="w-14 h-18 rounded-xl overflow-hidden relative flex-shrink-0">
                          <Image
                            src={winner.thumbnailUrl}
                            alt={winner.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Vote winners */}
        {data.voteWinners.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-5 h-5 text-pink-400" />
              <h3 className="text-white font-bold">5 Giải Bình Chọn</h3>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {data.voteWinners.map((w, i) => (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                >
                  <Link href={`/submissions/${w.id}`}>
                    <div className="bg-zinc-900 border border-pink-500/30 rounded-xl overflow-hidden hover:border-pink-500/70 transition-colors">
                      <div className="aspect-[3/4] relative bg-zinc-800">
                        {w.thumbnailUrl ? (
                          <Image src={w.thumbnailUrl} alt={w.title} fill className="object-cover" sizes="160px" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-zinc-600"><Star className="w-8 h-8" /></div>
                        )}
                        <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                          #{i + 1}
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="font-mono text-xs text-zinc-500">{w.entryCode}</div>
                        <div className="text-white text-xs font-bold line-clamp-2">{w.title}</div>
                        <div className="flex items-center gap-1 mt-1 text-pink-400 text-xs">
                          <Star className="w-3 h-3" />{w.voteCount}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.remaining.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-bold">Các Tác Phẩm Khác</h3>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {data.remaining.map((item, i) => (
                <motion.div
                  key={item.submissionId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link href={`/submissions/${item.submissionId}`}>
                    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all duration-300 relative">
                      <div className="aspect-[3/4] relative bg-zinc-800">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="220px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                            <Trophy className="w-8 h-8" />
                          </div>
                        )}

                        {/* Rank Badge / Entry Code */}
                        <div className="absolute inset-x-0 top-0 p-2 flex justify-start z-10">
                          <div className="bg-black/70 backdrop-blur-sm text-zinc-100 text-[11px] font-mono px-2 py-1 rounded-md border border-white/10">
                            {item.entryCode || "N/A"}
                          </div>
                        </div>

                        {/* Always visible gradient overlay at the bottom */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 transition-colors duration-300 group-hover:from-black">
                          <div className="text-white text-sm font-bold line-clamp-2 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">{item.title}</div>
                          <div className="mt-1 flex items-center gap-1.5 text-zinc-300 text-xs transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                            <UserRound className="w-3.5 h-3.5" />
                            <span className="line-clamp-1">{item.authorName || "Ẩn danh"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {data.remainingTotalPages > 1 && (
              <div className="flex items-center justify-between gap-3 mt-5">
                <p className="text-sm text-zinc-400">
                  Trang {data.remainingPage + 1}/{data.remainingTotalPages} · {data.remainingTotalElements} tác phẩm
                </p>
                <div className="flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={loading || data.remainingPage === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Trước
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setPage((prev) => Math.min(prev + 1, data.remainingTotalPages - 1))}
                    disabled={loading || data.remainingPage >= data.remainingTotalPages - 1}
                  >
                    Sau
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
