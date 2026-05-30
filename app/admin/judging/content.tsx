"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Loader2,
  Medal,
  RefreshCw,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";

const CONTEST_ID = "1740a8d0-988e-4d6e-84a2-ee8b01f2a5f3";

type Tab = "results" | "progress";

const RANK_CONFIG = [
  { rank: 1, label: "Giải Nhất", emoji: "🥇", prize: "1.000.000đ + 15.000.000đ hiện vật", color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/50 text-yellow-400" },
  { rank: 2, label: "Giải Nhì", emoji: "🥈", prize: "800.000đ + 7.000.000đ hiện vật", color: "from-zinc-400/20 to-zinc-500/10 border-zinc-400/50 text-zinc-300" },
  { rank: 3, label: "Giải Ba", emoji: "🥉", prize: "500.000đ + 3.000.000đ hiện vật", color: "from-amber-700/20 to-amber-800/10 border-amber-700/50 text-amber-600" },
  { rank: 4, label: "Khuyến Khích", emoji: "🏅", prize: "200.000đ + 2.000.000đ hiện vật", color: "from-blue-500/20 to-blue-600/10 border-blue-500/50 text-blue-400" },
];

export default function AdminJudgingContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("results");
  const [results, setResults] = useState<any[]>([]);
  const [voteWinners, setVoteWinners] = useState<any[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
      return;
    }
    if (!isLoading && user?.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  const fetchData = async (isRefresh = false) => {
    if (!user || user.role !== "admin") return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMessage("");
    try {
      const [resData, progData] = await Promise.all([
        api.judging.getAdminResults(CONTEST_ID),
        api.judging.getAdminProgress(CONTEST_ID),
      ]);
      setResults(Array.isArray(resData) ? resData : []);
      setProgress(progData);
      // Public results also has voteWinners
      const pubData = await api.judging.getPublicResults(CONTEST_ID);
      setVoteWinners(pubData.voteWinners || []);
    } catch (e: any) {
      console.error("Failed to load judging data", e);
      setResults([]);
      setProgress(null);
      setVoteWinners([]);
      setErrorMessage(e?.message || "Không tải được dữ liệu chấm điểm.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isLoading && user?.role === "admin") {
      fetchData();
    }
  }, [isLoading, user]);

  const top4 = results.filter((r) => r.averageScore > 0).slice(0, 4);
  const scoreBoard = showAll ? results : results.slice(0, 20);

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kết Quả Chấm Điểm BGK</h1>
          <p className="text-muted-foreground mt-1">Tổng hợp điểm 3 giám khảo — Cuộc thi CĂN SỐ</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm transition-colors border border-zinc-700"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Cập nhật
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl w-fit border border-zinc-800">
        {[
          { id: "results", label: "Kết quả & BXH", icon: Trophy },
          { id: "progress", label: "Tiến độ chấm", icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
            <div>
              <div className="font-semibold">Không tải được dữ liệu chấm điểm</div>
              <div className="mt-1 text-sm text-red-200/90">{errorMessage}</div>
              <button
                onClick={() => fetchData(true)}
                className="mt-3 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition-colors hover:bg-white"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {tab === "results" && (
            <div className="space-y-8">
              {/* Top 4 Award Cards */}
              <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Medal className="w-5 h-5 text-amber-400" /> Giải chính
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RANK_CONFIG.map((cfg) => {
                    const winner = top4.find((r) => r.rank === cfg.rank);
                    return (
                      <motion.div
                        key={cfg.rank}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: cfg.rank * 0.08 }}
                        className={`bg-gradient-to-br ${cfg.color} border rounded-2xl p-5 flex items-center gap-4`}
                      >
                        <span className="text-4xl">{cfg.emoji}</span>
                        <div className="flex-1">
                          <div className="font-bold text-sm uppercase tracking-wide opacity-70">{cfg.label}</div>
                          {winner ? (
                            <>
                              <div className="font-mono text-xs opacity-60">{winner.entryCode}</div>
                              <div className="font-bold text-base line-clamp-1">{winner.title}</div>
                              <div className="text-xs opacity-70 mt-0.5">{winner.authorName}</div>
                              <div className="text-xl font-black mt-1">{Number(winner.averageScore).toFixed(2)} điểm</div>
                            </>
                          ) : (
                            <div className="text-sm opacity-50 mt-1">Chưa có kết quả</div>
                          )}
                          <div className="text-xs opacity-50 mt-1">{cfg.prize}</div>
                        </div>
                        {winner?.thumbnailUrl && (
                          <div className="w-16 h-20 rounded-xl overflow-hidden relative flex-shrink-0">
                            <Image src={winner.thumbnailUrl} alt={winner.title} fill className="object-cover" sizes="64px" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Vote Winners */}
              {voteWinners.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-pink-400" /> 5 Giải Bình Chọn
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {voteWinners.map((w: any, i: number) => (
                      <motion.div
                        key={w.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-zinc-900 border border-pink-500/30 rounded-xl overflow-hidden"
                      >
                        <div className="aspect-[3/4] relative bg-zinc-800">
                          {w.thumbnailUrl ? (
                            <Image src={w.thumbnailUrl} alt={w.title} fill className="object-cover" sizes="200px" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-600"><Star className="w-8 h-8" /></div>
                          )}
                          <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">#{i + 1}</div>
                        </div>
                        <div className="p-3">
                          <div className="font-mono text-xs text-zinc-500">{w.entryCode}</div>
                          <div className="font-bold text-sm text-white line-clamp-1">{w.title}</div>
                          <div className="flex items-center gap-1 mt-1 text-pink-400 text-xs font-bold">
                            <Star className="w-3 h-3" />{w.voteCount} bình chọn
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Score Table */}
              <div>
                <h2 className="text-lg font-bold mb-4">Bảng Điểm Đầy Đủ</h2>
                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-900 border-b border-zinc-800">
                        <th className="text-left px-4 py-3 text-zinc-400 font-medium">Hạng</th>
                        <th className="text-left px-4 py-3 text-zinc-400 font-medium">Mã thi</th>
                        <th className="text-left px-4 py-3 text-zinc-400 font-medium">Tên bài</th>
                        <th className="text-center px-3 py-3 text-zinc-400 font-medium">BGK 1</th>
                        <th className="text-center px-3 py-3 text-zinc-400 font-medium">BGK 2</th>
                        <th className="text-center px-3 py-3 text-zinc-400 font-medium">BGK 3</th>
                        <th className="text-center px-3 py-3 text-zinc-400 font-medium font-bold">TB</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {scoreBoard.map((r: any) => (
                        <tr key={r.submissionId} className="hover:bg-zinc-900/50">
                          <td className="px-4 py-3">
                            {r.rank <= 4 ? (
                              <span>{["🥇", "🥈", "🥉", "🏅"][r.rank - 1]}</span>
                            ) : (
                              <span className="text-zinc-500">{r.rank}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-amber-400 text-xs">{r.entryCode}</td>
                          <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{r.title}</td>
                          <td className="px-3 py-3 text-center text-zinc-300">{r.judge1Score != null ? Number(r.judge1Score).toFixed(1) : "—"}</td>
                          <td className="px-3 py-3 text-center text-zinc-300">{r.judge2Score != null ? Number(r.judge2Score).toFixed(1) : "—"}</td>
                          <td className="px-3 py-3 text-center text-zinc-300">{r.judge3Score != null ? Number(r.judge3Score).toFixed(1) : "—"}</td>
                          <td className="px-3 py-3 text-center font-black text-lg text-white">{Number(r.averageScore).toFixed(2)}</td>
                        </tr>
                      ))}
                      {scoreBoard.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-10 text-zinc-500">BGK chưa chấm điểm bài nào</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {!showAll && results.length > 20 && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setShowAll(true)}
                      className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-all text-sm font-medium"
                    >
                      Xem toàn bộ ({results.length} bài)
                    </button>
                  </div>
                )}
                {showAll && results.length > 20 && (
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => setShowAll(false)}
                      className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-all text-sm font-medium"
                    >
                      Thu gọn
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "progress" && progress && (
            <div className="space-y-4">
              <div className="text-zinc-400 text-sm">
                Tổng số bài dự thi: <span className="text-white font-bold">{progress.totalSubmissions}</span>
              </div>
              {progress.judges?.map((j: any) => {
                const pct = progress.totalSubmissions ? Math.round((j.scored / progress.totalSubmissions) * 100) : 0;
                return (
                  <div key={j.judgeId} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-amber-400" />
                        <span className="font-semibold">{j.judgeName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black">{j.scored}</span>
                        <span className="text-zinc-500 text-sm">/{j.total}</span>
                        <span className="ml-2 text-xs text-zinc-500">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${pct === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                      />
                    </div>
                    {pct === 100 && (
                      <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã chấm xong tất cả
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
