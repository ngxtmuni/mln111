"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Loader2 } from "lucide-react";
import Footer from "@/components/footer";
import { API_URL } from "@/lib/api";
import { getNewsSponsor } from "@/lib/news-sponsor";

interface NewsDetail {
  id: string;
  title: string;
  summary: string;
  slug: string;
  content: string;
  coverImage: string | null;
  publishedAt: string;
  authorName: string;
  authorAvatar: string | null;
}

interface RelatedNews {
  id: string;
  title: string;
  summary: string;
  coverImage: string | null;
  publishedAt: string;
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [related, setRelated] = useState<RelatedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [newsRes, relatedRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/news/news/${id}`, { cache: "no-store" }),
          fetch(`${API_URL}/api/v1/news/news/${id}/related`, { cache: "no-store" }),
        ]);

        if (!newsRes.ok) {
          setNotFound(true);
          return;
        }

        const newsData = await newsRes.json();
        setNews(newsData);

        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelated(relatedData || []);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center gap-3 text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Đang tải bài viết...</span>
      </div>
    );
  }

  if (notFound || !news) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-zinc-400">
        <span className="text-5xl">📭</span>
        <p className="text-xl">Bài viết không tồn tại hoặc chưa được xuất bản.</p>
        <Link href="/news" className="text-[#393ADD] hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Quay lại tin tức
        </Link>
      </div>
    );
  }

  const sponsor = getNewsSponsor(news.title, news.slug);

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Cover image hero */}
      {news.coverImage && (
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={news.coverImage ? "-mt-16" : "mt-8"}
        >
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mb-8 py-2"
          >
            <ArrowLeft size={16} />
            Quay lại tin tức
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 relative z-20"
        >
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-snug">
              {news.title}
            </h1>

            {sponsor ? (
              <a
                href={sponsor.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit shrink-0 items-center rounded-2xl border border-zinc-700 bg-white px-3 py-2 transition-transform duration-300 hover:scale-[1.02]"
                aria-label={`Truy cập ${sponsor.name}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sponsor.logoSrc}
                  alt={sponsor.logoAlt}
                  className="h-10 w-auto max-w-[7rem] object-contain"
                />
              </a>
            ) : null}
          </div>

          {news.summary && (
            <p className="text-xl text-zinc-400 leading-relaxed border-l-4 border-[#393ADD] pl-4 mb-6 italic">
              {news.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-500 border-b border-zinc-800 pb-6">
            <span className="flex items-center gap-2">
              <User size={14} />
              <span className="text-zinc-300 font-medium">{news.authorName || "Biên tập viên"}</span>
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              <time>{format(new Date(news.publishedAt), "dd 'tháng' M, yyyy 'lúc' HH:mm", { locale: vi })}</time>
            </span>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="
            prose prose-base md:prose-lg max-w-none
            prose-invert
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-3xl md:prose-h1:text-4xl prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-xl md:prose-h3:text-2xl
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-[#7778FF] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-blockquote:border-l-[#393ADD] prose-blockquote:text-zinc-400 prose-blockquote:italic
            prose-ul:text-zinc-300 prose-ol:text-zinc-300
            prose-li:marker:text-[#393ADD]
            prose-code:text-[#7778FF] prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-6 md:prose-img:my-8
            prose-hr:border-zinc-700
          "
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Related articles */}
        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 border-t border-zinc-800 pt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/news/${item.id}`} className="group block">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#393ADD]/50 transition-all duration-300">
                    <div className="h-36 overflow-hidden bg-zinc-800">
                      {item.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#393ADD]/20 to-zinc-800" />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-zinc-600 mb-1">
                        {format(new Date(item.publishedAt), "dd/MM/yyyy", { locale: vi })}
                      </p>
                      <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-[#7778FF] transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}
