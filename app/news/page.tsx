"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Loader2 } from "lucide-react";
import ParallaxHero from "@/components/parallax-hero";
import Footer from "@/components/footer";
import { API_URL } from "@/lib/api";
import { getNewsSponsor } from "@/lib/news-sponsor";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  slug: string;
  coverImage: string | null;
  publishedAt: string;
}

function NewsCard({ news, index }: { news: NewsItem; index: number }) {
  const sponsor = getNewsSponsor(news.title, news.slug);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.06 }}
    >
      <div className="group h-full bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-[#393ADD]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,58,221,0.15)] flex flex-col">
        <Link href={`/news/${news.id}`} className="block">
          {/* Cover image */}
          <div className="h-52 overflow-hidden bg-zinc-800 flex-shrink-0 relative">
            {news.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={news.coverImage}
                alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#393ADD]/30 to-zinc-800 flex items-center justify-center">
                <span className="text-zinc-600 text-5xl">📰</span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
            <Calendar size={12} />
            <time>{format(new Date(news.publishedAt), "dd 'tháng' M, yyyy", { locale: vi })}</time>
          </div>

          <div className="mb-2 flex items-start gap-3">
            <Link href={`/news/${news.id}`} className="flex-1">
              <h3 className="flex-1 text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-[#7778FF] transition-colors">
                {news.title}
              </h3>
            </Link>

            {sponsor ? (
              <a
                href={sponsor.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Truy cập ${sponsor.name}`}
                className="shrink-0 rounded-xl border border-zinc-700/80 bg-white px-2 py-1 transition-transform duration-300 hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sponsor.logoSrc}
                  alt={sponsor.logoAlt}
                  className="h-8 w-auto max-w-[4.5rem] object-contain"
                />
              </a>
            ) : null}
          </div>

          <Link href={`/news/${news.id}`} className="flex flex-1 flex-col">
            {news.summary && (
              <p className="text-zinc-400 text-sm line-clamp-3 leading-relaxed flex-1">
                {news.summary}
              </p>
            )}

            <div className="flex items-center gap-1 text-[#393ADD] text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
              Đọc tiếp <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function NewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNews = async (pageNum: number, append = false) => {
    try {
      const res = await fetch(
        `${API_URL}/api/v1/news/news?page=${pageNum}&limit=9`,
        { cache: "no-store" }
      );
      const data = await res.json();
      const items: NewsItem[] = data.items || [];
      setNewsList((prev) => (append ? [...prev, ...items] : items));
      setHasMore(pageNum < data.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setLoadingMore(true);
    fetchNews(nextPage, true);
  };

  return (
    <ParallaxHero
      title="Tin Tức"
      description=""
      textMainClass="text-[#393ADD]"
      descriptionClass="text-gray-400"
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
    >
      <main className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 md:px-12 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Tất cả bài viết
            </h2>
            <div className="w-16 h-1 bg-[#393ADD] rounded-full" />
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3 text-zinc-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Đang tải bài viết...</span>
            </div>
          ) : newsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-500 gap-4">
              <span className="text-5xl">📭</span>
              <p className="text-lg">Chưa có bài viết nào được xuất bản.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsList.map((news, index) => (
                  <NewsCard key={news.id} news={news} index={index} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-[#393ADD] hover:bg-[#393ADD]/90 text-white font-bold px-10 py-3 rounded-full cursor-pointer transition-all shadow-lg disabled:opacity-60 flex items-center gap-2"
                  >
                    {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loadingMore ? "Đang tải..." : "Xem thêm"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <Footer />
      </main>
    </ParallaxHero>
  );
}

