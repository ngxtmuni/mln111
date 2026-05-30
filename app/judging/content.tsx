"use client";

import { memo, startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  LayoutGrid,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import ScoringModal from "./components/ScoringModal";
import ScoringCriteria from "./components/ScoringCriteria";

const CONTEST_ID = "1740a8d0-988e-4d6e-84a2-ee8b01f2a5f3";
const ITEMS_PER_PAGE = 8;

type Tab = "submissions" | "criteria";

type SubmissionMedia = {
  mediaType?: string;
  mediaUrl: string;
};

type JudgingSubmission = {
  id: string;
  entryCode: string;
  title: string;
  description?: string | null;
  scored?: boolean;
  media?: SubmissionMedia[];
  coverImage?: string | null;
};

export default function JudgingContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<JudgingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringSubmission, setScoringSubmission] = useState<JudgingSubmission | null>(null);
  const [detailSubmission, setDetailSubmission] = useState<JudgingSubmission | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const canScore = user?.role === "judge";

  // Guard: only judge
  useEffect(() => {
    if (!isLoading && user && user.role !== "judge") {
      router.replace("/");
    }
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const fetchSubmissions = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await api.judging.getSubmissions(CONTEST_ID);
      const normalized = Array.isArray(data)
        ? data.map((submission: any) => ({
            ...submission,
            media: Array.isArray(submission.media)
              ? submission.media.map((media: SubmissionMedia) => ({
                  ...media,
                  mediaType: media.mediaType?.toUpperCase(),
                }))
              : [],
            coverImage:
              submission.media?.find(
                (media: SubmissionMedia) => media.mediaType?.toUpperCase() === "IMAGE"
              )?.mediaUrl ?? null,
          }))
        : [];
      setSubmissions(normalized);
    } catch (e: any) {
      console.error("Failed to fetch judging submissions", e);
      setSubmissions([]);
      setErrorMessage(e?.message || "Không tải được danh sách bài dự thi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions, refreshKey]);

  const handleScored = () => {
    setScoringSubmission(null);
    setRefreshKey((k) => k + 1);
  };

  const scoredCount = submissions.filter((s) => s.scored).length;
  const totalCount = submissions.length;

  // Pagination logic
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const currentItems = useMemo(
    () =>
      submissions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [currentPage, submissions]
  );

  if (isLoading || !user || user.role !== "judge") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="hidden sm:inline">🎨</span> BGK Chấm Điểm — Căn Số 2026
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              Xin chào, <span className="text-amber-400 font-medium">{user.name}</span>
            </p>
          </div>
          {/* Progress pill */}
          <div className="flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-medium">
              {scoredCount} / {totalCount} bài
            </span>
            <div className="w-16 sm:w-24 h-1.5 bg-zinc-700 rounded-full overflow-hidden hidden xs:block ml-1">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: totalCount ? `${(scoredCount / totalCount) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-0">
          {[
            { id: "submissions", label: "Bài Dự Thi", icon: LayoutGrid },
            { id: "criteria", label: "Tiêu Chí Chấm Điểm", icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                startTransition(() => {
                  setTab(id as Tab);
                  setCurrentPage(1);
                });
              }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === id
                  ? "border-amber-400 text-amber-400"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {tab === "criteria" && <ScoringCriteria />}

        {tab === "submissions" && (
          <>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-zinc-400 animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentItems.map((sub, idx) => (
                    <SubmissionJudgingCard
                      key={sub.id}
                      submission={sub}
                      canScore={canScore}
                      onScore={() => {
                        startTransition(() => setScoringSubmission(sub));
                      }}
                      onViewDetail={() => {
                        startTransition(() => setDetailSubmission(sub));
                      }}
                    />
                  ))}
                  {!errorMessage && submissions.length === 0 && (
                    <div className="col-span-full text-center text-zinc-500 py-20">
                      Chưa có bài dự thi nào được duyệt.
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-100">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                      <div>
                        <div className="font-semibold">Không tải được dữ liệu chấm điểm</div>
                        <div className="mt-1 text-sm text-red-200/90">{errorMessage}</div>
                        <button
                          onClick={() => {
                            startTransition(() => {
                              setCurrentPage(1);
                              fetchSubmissions();
                            });
                          }}
                          className="mt-3 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition-colors hover:bg-white"
                        >
                          Thử lại
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pagination */}
                {!errorMessage && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => {
                        startTransition(() => setCurrentPage((prev) => Math.max(1, prev - 1)));
                      }}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          startTransition(() => setCurrentPage(page));
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-amber-500 text-black"
                            : "bg-zinc-800 text-white hover:bg-zinc-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        startTransition(() => setCurrentPage((prev) => Math.min(totalPages, prev + 1)));
                      }}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-full bg-zinc-800 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-700 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailSubmission && (
          <SubmissionDetailModal
            submission={detailSubmission}
            canScore={canScore}
            onClose={() => setDetailSubmission(null)}
            onScore={() => {
              startTransition(() => {
                setScoringSubmission(detailSubmission);
                setDetailSubmission(null);
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Scoring Modal */}
      <AnimatePresence>
        {scoringSubmission && (
          <ScoringModal
            submission={scoringSubmission}
            canScore={canScore}
            onClose={() => setScoringSubmission(null)}
            onSaved={handleScored}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const SubmissionJudgingCard = memo(function SubmissionJudgingCard({
  submission,
  canScore,
  onScore,
  onViewDetail,
}: {
  submission: JudgingSubmission;
  canScore: boolean;
  onScore: () => void;
  onViewDetail: () => void;
}) {
  return (
    <article className="bg-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl flex flex-col group h-full hover:shadow-2xl transition-all duration-300 border border-zinc-800">
      {/* Image Container */}
      <div className="aspect-[3/4] relative bg-zinc-900 overflow-hidden cursor-pointer" onClick={onViewDetail}>
        {submission.coverImage ? (
          <Image
            src={submission.coverImage}
            alt={submission.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 22vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
            <ImageOff className="w-16 h-16 opacity-20" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20 opacity-60" />

        {/* Entry code badge */}
        <div className="absolute top-3 left-3 bg-amber-500 text-black font-mono font-black text-[10px] px-2 py-1 rounded-md z-20 shadow-lg">
          {submission.entryCode}
        </div>

        {/* Scored badge */}
        {submission.scored && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded-md z-20 shadow-lg flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Đã chấm
          </div>
        )}

        {/* Quick View Icon */}
        <div className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white border border-white/20">
              <Eye className="w-4 h-4" />
           </div>
        </div>
      </div>

      {/* Info Section - matching user site style */}
      <div className="bg-[#6b6b6b] p-4 flex flex-col flex-1 text-white">
        <h3 className="font-bold text-base line-clamp-2 mb-2 group-hover:text-amber-300 transition-colors leading-snug h-12">
          {submission.title}
        </h3>
        
        <p className="text-white/60 text-[11px] line-clamp-2 mb-4 flex-1 leading-relaxed italic">
          {submission.description || "Không có mô tả..."}
        </p>

        <div className="flex gap-2 mt-auto">
           <button
            onClick={(e) => {
              e.stopPropagation();
              if (canScore) {
                onScore();
                return;
              }
              onViewDetail();
            }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
              canScore
                ? submission.scored
                  ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg"
                : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700"
            }`}
          >
            {canScore ? (submission.scored ? "Sửa điểm" : "Chấm điểm") : "Xem chi tiết"}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10"
          >
            <FileText className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );
});

function SubmissionDetailModal({
  submission,
  canScore,
  onClose,
  onScore,
}: {
  submission: JudgingSubmission;
  canScore: boolean;
  onClose: () => void;
  onScore: () => void;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const zoomIn = () => setZoom((z) => Math.min(z + 0.5, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.5, 0.5));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const closeLightbox = () => { setLightboxOpen(false); resetZoom(); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current.x = e.clientX;
    dragStart.current.y = e.clientY;
    dragStart.current.panX = pan.x;
    dragStart.current.panY = pan.y;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <span className="text-amber-500">[{submission.entryCode}]</span> {submission.title}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body - 2 columns */}
          <div className="flex-1 overflow-hidden flex min-h-0">
            {/* Left: Poster */}
            <div className="w-[45%] shrink-0 bg-zinc-950 border-r border-zinc-800 relative group flex items-center justify-center p-4">
              {submission.coverImage ? (
                <>
                  <div className="relative w-full h-full cursor-zoom-in" onClick={() => setLightboxOpen(true)}>
                    <Image
                      src={submission.coverImage}
                      alt={submission.title}
                      fill
                      className="object-contain"
                      sizes="45vw"
                      priority
                    />
                  </div>
                  {/* Zoom hint overlay */}
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white/20"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Phóng to
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center text-zinc-700">
                  <ImageOff className="w-20 h-20 opacity-20" />
                </div>
              )}
            </div>

            {/* Right: Description only */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-amber-500 font-bold mb-3 uppercase text-sm tracking-wider">Mô tả tác phẩm</h3>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-800/50 p-5 rounded-2xl border border-zinc-700/50 shadow-inner">
                {submission.description || "Không có mô tả."}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 flex justify-end shrink-0">
            {canScore ? (
              <button
                onClick={onScore}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Tiến hành chấm điểm
              </button>
            ) : (
              <button
                onClick={onClose}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-3 rounded-xl transition-all"
              >
                Đóng
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Zoom Lightbox */}
      {lightboxOpen && submission.coverImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex flex-col select-none"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Lightbox toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 shrink-0">
            <span className="text-zinc-400 text-sm font-medium">{submission.entryCode} — {submission.title}</span>
            <div className="flex items-center gap-2">
              <button onClick={zoomOut} disabled={zoom <= 0.5} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button onClick={resetZoom} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono transition-colors min-w-[52px] text-center">
                {Math.round(zoom * 100)}%
              </button>
              <button onClick={zoomIn} disabled={zoom >= 4} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-zinc-700 mx-1" />
              <button onClick={() => closeLightbox()} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lightbox image - drag to pan */}
          <div
            className="flex-1 overflow-hidden flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              onMouseDown={handleMouseDown}
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.2s ease",
                cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default",
                userSelect: "none",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={submission.coverImage}
                alt={submission.title}
                draggable={false}
                style={{ maxWidth: "80vw", maxHeight: "78vh", objectFit: "contain", display: "block" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
