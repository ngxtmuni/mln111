"use client";

import ParallaxHero from "@/components/parallax-hero";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Star,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api, Contest } from "@/lib/api";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 8;

function ContestantCard({
  contestant,
  onVoteClick,
}: {
  contestant: any;
  onVoteClick: (id: string) => void;
}) {
  return (
    <Link href={`/submissions/${contestant.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group h-full flex flex-col"
      >
        {/* Image placeholder */}
        <div className="aspect-[3/4] bg-gray-100 relative">
          {contestant.thumbnailUrl ? (
            <Image
              src={contestant.thumbnailUrl}
              alt={contestant.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 text-gray-300">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            </div>
          )}
          {contestant.entryCode && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-mono font-bold px-2 py-1 rounded backdrop-blur-sm z-10">
              {contestant.entryCode}
            </div>
          )}
        </div>

        {/* Info overlay */}
        <div className="bg-[#6b6b6b] p-4 text-white flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg line-clamp-1">{contestant.title}</h3>
              <p className="text-sm opacity-80">{contestant.author?.name}</p>
              <p className="text-xs opacity-60 mt-1 bg-white/10 px-2 py-0.5 rounded-full hidden">{contestant.categoryName}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">{contestant.voteCount}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (contestant.isVotable) {
                  onVoteClick(contestant.id);
                }
              }}
              disabled={contestant.userHasVoted || !contestant.isVotable}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${contestant.userHasVoted
                ? "bg-green-600 text-white cursor-default"
                : !contestant.isVotable
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-white"
                }`}
            >
              {contestant.userHasVoted ? "Đã bình chọn" : (!contestant.isVotable ? "Chưa mở" : "Bình chọn")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                // Handle share
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${currentPage === page
            ? "bg-primary text-white"
            : "bg-[#6b6b6b] text-white hover:bg-[#5a5a5a]"
            }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function ContestVotePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [contestId, setContestId] = useState("");
  const [contests, setContests] = useState<any[]>([]); // Added contests state
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"TOP" | "NEW">("TOP");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isContestDropdownOpen, setIsContestDropdownOpen] = useState(false); // Added contest dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOutOfVotesModal, setShowOutOfVotesModal] = useState(false);
  const [selectedContestantId, setSelectedContestantId] = useState<string | null>(null);
  const [votesUsed, setVotesUsed] = useState(0);
  const [showSelfVoteModal, setShowSelfVoteModal] = useState(false);

  // Fetch Contest & Categories
  useEffect(() => {
    const init = async () => {
      try {
        const contestsRes = await api.contests.getAll({ limit: 100 });
        let contestList: any[] = [];
        if (contestsRes.items) {
          contestList = contestsRes.items;
        } else if (Array.isArray(contestsRes.data)) {
          contestList = contestsRes.data;
        }

        setContests(contestList); // Store contests

        if (contestList.length > 0) {
          // Prefer voting contests, then submit_open
          const votingContest = contestList.find((c: any) => c.status === 'voting');
          const submitContest = contestList.find((c: any) => c.status === 'submit_open');

          const id = votingContest ? votingContest.id : (submitContest ? submitContest.id : contestList[0].id);

          setContestId(id);
        }
      } catch (e) {
        console.error("Init failed", e);
      }
    };
    init();
  }, []);

  // Fetch Categories and Vote Status when contestId changes
  useEffect(() => {
    if (!contestId) return;
    const fetchData = async () => {
      try {
        const cats = await api.contests.getCategories(contestId);
        setCategories(cats);
        setSelectedCategoryId(""); // Reset category when contest changes

        if (user) {
          const status = await api.contests.getSignupStatus(contestId);
          setVotesUsed(status.votesUsed || 0);
        }
      } catch (e) {
        console.error("Fetch data failed", e);
      }
    }
    fetchData();
  }, [contestId, user]);

  // Fetch Submissions
  useEffect(() => {
    if (!contestId) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await api.contests.getSubmissions(contestId, {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          categoryId: selectedCategoryId,
          q: searchQuery,
          sort: activeTab === 'TOP' ? 'most_voted' : 'newest'
        });

        if (res.items) {
          setSubmissions(res.items);
          setTotalPages(res.totalPages || 1);
        } else if (Array.isArray(res.data)) {
          setSubmissions(res.data);
          setTotalPages(res.totalPages || 1);
        } else {
          setSubmissions([]);
        }
      } catch (e) {
        console.error("Fetch submissions failed", e);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchSubmissions();
    }, 500);
    return () => clearTimeout(timer);

  }, [contestId, currentPage, selectedCategoryId, searchQuery, activeTab]);

  const handleVoteClick = (id: string) => {
    if (!user) {
      // Redirect to login or show alert
      if (confirm("Bạn cần đăng nhập để bình chọn. Đi tới trang đăng nhập?")) {
        router.push("/login");
      }
      return;
    }
    const sub = submissions.find(s => s.id === id);
    if (!sub || sub.userHasVoted) return;

    // NO SELF VOTE CHECK (Frontend Check)
    if (sub.author?.id === user.id) {
      setShowSelfVoteModal(true);
      return;
    }

    if (votesUsed >= 3) {
      setShowOutOfVotesModal(true);
      return;
    }

    setSelectedContestantId(id);
    setShowVoteModal(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedContestantId) return;

    // Optimistic Update
    const previousSubmissions = [...submissions];
    setSubmissions(prev => prev.map(s => {
      if (s.id === selectedContestantId) {
        return { ...s, voteCount: (s.voteCount || 0) + 1, userHasVoted: true };
      }
      return s;
    }));
    setShowVoteModal(false); // Close immediately for better UX

    try {
      await api.submissions.vote(selectedContestantId);

      setShowSuccessModal(true);
      setVotesUsed(prev => prev + 1);
      setTimeout(() => {
        setShowSuccessModal(false);
        setSelectedContestantId(null);
      }, 2000);
    } catch (e: any) {
      console.error("Vote failed", e);
      // Rollback UI
      setSubmissions(previousSubmissions);

      // Show error message
      // Check if error is due to vote limit to show the specific modal
      if (e.message && e.message.includes("dùng hết 3 lượt")) {
        setShowOutOfVotesModal(true);
      } else if (e.message && e.message.includes("chính mình")) {
        setShowSelfVoteModal(true);
      } else {
        alert("Bình chọn thất bại. Vui lòng thử lại.");
      }
    }
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name || "Tất cả hạng mục";
  // const selectedContestName = contests.find(c => c.id === contestId)?.title || "Chọn cuộc thi";

  return (
    <ParallaxHero
      title="CUỘC THI SÁNG TẠO NGHỆ THUẬT"
      description="Lời kêu gọi gửi đến cộng đồng trẻ yêu Di sản Văn hóa Việt Nam"
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
      heroChildren={
        <Link
          href="/contests/submit"
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300"
        >
          Tham gia ngay
        </Link>
      }
    >
      <main className="min-h-screen bg-[#1a1a1a]">
        <div className="container mx-auto px-4 py-12">
          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
              {/* Search Input */}
              <div className="flex-1 flex items-center bg-white rounded-full overflow-hidden shadow-md w-full h-[48px]">
                <div className="pl-4 pr-2 flex items-center justify-center">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã bài thi (ví dụ: CS0001)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-3 focus:outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#4a4a4a] rounded-full p-1 inline-flex">
              <button
                onClick={() => {
                  setActiveTab("TOP");
                  setCurrentPage(1);
                }}
                className={`px-8 py-2 rounded-full font-semibold transition-colors ${activeTab === "TOP"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                NỔI BẬT
              </button>
              <button
                onClick={() => {
                  setActiveTab("NEW");
                  setCurrentPage(1);
                }}
                className={`px-8 py-2 rounded-full font-semibold transition-colors ${activeTab === "NEW"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                MỚI NHẤT
              </button>
            </div>
          </div>

          {/* Contestant Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
              >
                {submissions.length > 0 ? (
                  submissions.map((contestant) => (
                    <ContestantCard
                      key={contestant.id}
                      contestant={contestant}
                      onVoteClick={handleVoteClick}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-10">
                    Chưa có bài dự thi nào
                  </div>
                )}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}

        </div>

        {/* Vote Confirmation Modal */}
        {showVoteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#E5D4C8] rounded-3xl p-8 max-w-md w-full text-center"
            >
              <h3 className="text-gray-800 font-semibold text-lg mb-6">
                Bạn có chắc chắn muốn bình chọn cho tác phẩm này? <br />
                <span className="text-sm text-gray-600 font-normal mt-2 block">
                  (Bạn còn {3 - votesUsed} lượt tham gia bình chọn)
                </span>
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleConfirmVote}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Bình chọn
                </button>
                <button
                  onClick={() => setShowVoteModal(false)}
                  className="bg-[#C5B8AD] hover:bg-[#B0A49A] text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Out of Votes Modal */}
        {showOutOfVotesModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#E5D4C8] rounded-3xl p-8 max-w-md w-full text-center"
            >
              <h3 className="text-gray-800 font-semibold text-lg mb-6">
                Bạn đã hết lượt bình chọn
              </h3>
              <p className="text-gray-700 mb-6">
                Bạn đã dùng hết 3 lượt bình chọn. Cảm ơn bạn đã tham gia!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowOutOfVotesModal(false)}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#E5D4C8] rounded-3xl p-8 max-w-md w-full text-center"
            >
              <h3 className="text-gray-800 font-semibold text-lg mb-6">
                Bình chọn thành công
              </h3>
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Self Vote Modal */}
        {showSelfVoteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#E5D4C8] rounded-3xl p-8 max-w-md w-full text-center"
            >
              <h3 className="text-gray-800 font-semibold text-lg mb-6">
                Không thể bình chọn
              </h3>
              <p className="text-gray-700 mb-6">
                Bạn không thể bình chọn cho bài dự thi của chính mình. Hãy kêu gọi bạn bè vào bình chọn nhé!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => setShowSelfVoteModal(false)}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Đã hiểu
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </main>
    </ParallaxHero>
  );
}
