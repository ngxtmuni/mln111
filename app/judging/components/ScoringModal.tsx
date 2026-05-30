"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { AlertCircle, X, Loader2, Save } from "lucide-react";
import Image from "next/image";

const CRITERIA = [
  // Nhóm I: Chuyên môn (40%)
  { key: "scoreLayout", label: "Bố cục & Thị giác", weight: 10, group: "I" },
  { key: "scoreColor", label: "Màu sắc & Hình khối", weight: 10, group: "I" },
  { key: "scoreTechnique", label: "Kỹ thuật & Ứng dụng số", weight: 10, group: "I" },
  { key: "scoreLanguage", label: "Ngôn ngữ thiết kế", weight: 10, group: "I" },
  // Nhóm II: Tiêu chí khác (60%)
  { key: "scorePerception", label: "Cảm nhận & Cách diễn giải", weight: 15, group: "II" },
  { key: "scoreCulture", label: "Kết nối tín ngưỡng văn hóa dân gian", weight: 15, group: "II" },
  { key: "scoreModernity", label: "Tính thời đại", weight: 10, group: "II" },
  { key: "scoreCreativity", label: "Sáng tạo & Đột phá", weight: 10, group: "II" },
  { key: "scoreImpact", label: "Khả năng lan tỏa", weight: 10, group: "II" },
] as const;

type ScoreKey = typeof CRITERIA[number]["key"];
type Scores = Record<ScoreKey, number>;

const emptyScores = (): Scores =>
  Object.fromEntries(CRITERIA.map((c) => [c.key, 0])) as Scores;

function computeTotal(scores: Scores): number {
  return CRITERIA.reduce((acc, c) => acc + (scores[c.key] || 0) * (c.weight / 100), 0);
}

export default function ScoringModal({
  submission,
  canScore,
  onClose,
  onSaved,
}: {
  submission: any;
  canScore: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [scores, setScores] = useState<Scores>(emptyScores());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");

  const coverImage = submission.media?.find((m: any) => m.mediaType?.toUpperCase() === "IMAGE")?.mediaUrl;

  // Load existing score if any
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const existing = await api.judging.getMyScore(submission.id);
        if (existing && existing.scoreLayout !== undefined) {
          const mapped: Scores = {} as Scores;
          CRITERIA.forEach((c) => { mapped[c.key] = existing[c.key] ?? 0; });
          setScores(mapped);
          setNotes(existing.notes || "");
        }
      } catch (e: any) {
        console.error("Failed to load current score", e);
        setLoadError(e?.message || "Không tải được điểm hiện tại.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [submission.id]);

  const handleSave = async () => {
    if (!canScore) {
      onClose();
      return;
    }
    setSaving(true);
    try {
      await api.judging.submitScore(submission.id, { ...scores, notes });
      onSaved();
    } catch (e) {
      console.error("Failed to save score", e);
      alert("Lưu điểm thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const total = computeTotal(scores);
  let currentGroup = "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            {coverImage && (
              <div className="w-16 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                <Image src={coverImage} alt={submission.title} fill className="object-cover" sizes="64px" />
              </div>
            )}
            <div>
              <span className="bg-amber-500/20 text-amber-400 font-mono text-xs font-bold px-2 py-0.5 rounded">
                {submission.entryCode}
              </span>
              <h2 className="text-white font-bold text-lg mt-1 line-clamp-2">{submission.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                <div>
                  <div className="font-semibold">Không tải được dữ liệu chấm điểm</div>
                  <div className="mt-1 text-sm text-red-200/90">{loadError}</div>
                </div>
              </div>
            </div>
          ) : (
            CRITERIA.map((criterion) => {
              const showGroupHeader = criterion.group !== currentGroup;
              if (showGroupHeader) currentGroup = criterion.group;
              return (
                <div key={criterion.key}>
                  {showGroupHeader && (
                    <div className={`text-xs font-bold uppercase tracking-widest mb-2 mt-4 first:mt-0 ${criterion.group === "I" ? "text-blue-400" : "text-cyan-400"}`}>
                      {criterion.group === "I"
                        ? "Nhóm I — Chuyên môn (40%)"
                        : "Nhóm II — Tiêu chí khác (60%)"}
                    </div>
                  )}
                  <div className="bg-zinc-800/60 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white font-medium">{criterion.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-xs">{criterion.weight}%</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={scores[criterion.key]}
                          onChange={(e) => setScores((prev) => ({
                            ...prev,
                            [criterion.key]: Math.min(100, Math.max(0, Number(e.target.value))),
                          }))}
                          className="w-14 bg-zinc-700 border border-zinc-600 rounded-lg text-center text-white text-sm py-1 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={scores[criterion.key]}
                      onChange={(e) => setScores((prev) => ({
                        ...prev,
                        [criterion.key]: Number(e.target.value),
                      }))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-zinc-600 mt-0.5">
                      <span>0</span><span>50</span><span>100</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Notes */}
          <div className="mt-4">
            <label className="text-sm text-zinc-400 font-medium mb-1.5 block">Ghi chú (không bắt buộc)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-amber-500"
              placeholder="Nhận xét về tác phẩm..."
            />
          </div>
        </div>

        {/* Footer — total + save */}
        <div className="border-t border-zinc-800 p-5 flex items-center justify-between">
          <div className="text-center">
            <div className="text-xs text-zinc-500 mb-0.5">Tổng điểm (có trọng số)</div>
            <div className={`text-3xl font-black ${total >= 80 ? "text-emerald-400" : total >= 50 ? "text-amber-400" : "text-red-400"}`}>
              {total.toFixed(2)}
              <span className="text-sm font-normal text-zinc-500">/100</span>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !!loadError || !canScore}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold px-6 py-3 rounded-xl transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {canScore ? "Lưu điểm" : "Chỉ BGK mới được chấm"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
