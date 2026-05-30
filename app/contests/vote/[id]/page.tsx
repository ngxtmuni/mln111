"use client";

import ParallaxHero from "@/components/parallax-hero";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Star, Share2, Check } from "lucide-react";
import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Mock data for contestants
const mockContestants = [
  {
    id: "SH123",
    name: "Nguyễn Vũ My",
    category: "Tranh đồng hồ",
    rating: 5,
    image: "",
    description: `Đề tài: Hãy khám phá "cái căn" của chính mình, là cảm nhận, rung động, niềm tin, hay mảnh ký ức văn hóa, và tái diễn giải chúng bằng ngôn ngữ nghệ thuật của thời đại số. Dù là một nét vẽ, một thiết kế hay một câu chuyện, mỗi tác phẩm là dấu chỉ để bạn trả lời câu hỏi "Bạn có căn không?"

Căn trong di sản
Căn trong tâm linh
Căn trong bản ngã sáng tạo
Tất cả đều đúng, miễn đó là tiếng gọi của bạn.`,
  },
  {
    id: "SH001",
    name: "Nguyễn Văn A",
    category: "Tranh Đồng Hồ",
    rating: 5,
    image: "",
    description: "",
  },
  {
    id: "SH002",
    name: "Nguyễn Văn A",
    category: "Tranh Đồng Hồ",
    rating: 5,
    image: "",
    description: "",
  },
  {
    id: "SH003",
    name: "Nguyễn Văn A",
    category: "Tranh Đồng Hồ",
    rating: 5,
    image: "",
    description: "",
  },
  {
    id: "SH004",
    name: "Nguyễn Văn A",
    category: "Tranh Đồng Hồ",
    rating: 5,
    image: "",
    description: "",
  },
];

function RelatedCard({
  contestant,
  onVoteClick,
}: {
  contestant: (typeof mockContestants)[0];
  onVoteClick: (id: string) => void;
}) {
  return (
    <Link href={`/contests/vote/${contestant.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer"
      >
        {/* Image placeholder */}
        <div className="aspect-[3/4] bg-[#f5d5d0] relative">
          {contestant.image ? (
            <Image
              src={contestant.image}
              alt={contestant.name}
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Info overlay */}
        <div className="bg-[#6b6b6b] p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{contestant.name}</h3>
              <p className="text-sm opacity-80">{contestant.category}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span className="text-sm">{contestant.rating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                onVoteClick(contestant.id);
              }}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            >
              Bình chọn
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
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

export default function ContestSubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<string | null>(null);

  // Find contestant by ID
  const contestant =
    mockContestants.find((c) => c.id === id) || mockContestants[0];

  // Get related contestants (same category, excluding current)
  const relatedContestants = mockContestants
    .filter((c) => c.id !== id)
    .slice(0, 4);

  const handleVoteClick = (contestantId: string) => {
    setSelectedContestant(contestantId);
    setShowVoteModal(true);
  };

  const handleConfirmVote = () => {
    setShowVoteModal(false);
    setShowSuccessModal(true);
    // Auto close success modal after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
      setSelectedContestant(null);
    }, 2000);
  };

  const handleCancelVote = () => {
    setShowVoteModal(false);
    setSelectedContestant(null);
  };

  return (
    <ParallaxHero
      title="CUỘC THI SÁNG TẠO NGHỆ THUẬT"
      description="Lời kêu gọi gửi đến cộng đồng trẻ yêu Di sản Văn hóa Việt Nam"
      imageUrl="https://i.ibb.co/BHqDThSQ/C-ng-ng.png"
    >
      <main className="min-h-screen bg-[#1a1a1a]">
        <div className="container mx-auto px-4 py-12">
          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden mb-12"
          >
            {/* Submission Image */}
            <div className="aspect-video bg-gray-200 relative">
              {contestant.image ? (
                <Image
                  src={contestant.image}
                  alt={contestant.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 text-gray-400">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-primary">
                  {contestant.name}
                </h1>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3 text-gray-700 mb-8">
                <p>
                  <span className="font-semibold">Mã dự thi:</span>{" "}
                  {contestant.id}
                </p>
                <p>
                  <span className="font-semibold">Thể loại:</span>{" "}
                  <span className="text-primary">{contestant.category}</span>
                </p>
                <div>
                  <span className="font-semibold">Mô tả:</span>
                  <p className="mt-2 whitespace-pre-line leading-relaxed">
                    {contestant.description ||
                      "Chưa có mô tả cho bài dự thi này."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleVoteClick(contestant.id)}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                >
                  Bình chọn
                </button>
              </div>
            </div>
          </motion.div>

          {/* Related Submissions Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              BÀI THI KHÁC CÙNG THỂ LOẠI
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedContestants.map((related) => (
                <RelatedCard
                  key={related.id}
                  contestant={related}
                  onVoteClick={handleVoteClick}
                />
              ))}
            </div>
          </motion.section>
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
                Bạn có 3 lượt bình chọn
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleConfirmVote}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Bình chọn
                </button>
                <button
                  onClick={handleCancelVote}
                  className="bg-[#C5B8AD] hover:bg-[#B0A49A] text-white font-semibold px-8 py-3 rounded-full transition-colors"
                >
                  Hủy
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

        <Footer />
      </main>
    </ParallaxHero>
  );
}
