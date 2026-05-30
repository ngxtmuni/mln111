"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Heart, Share2, User, Calendar, Tag, Check, Flag, AlertTriangle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile } from "@marsidev/react-turnstile";

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const id = params.id as string;

  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Vote States
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votesUsed, setVotesUsed] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Report States
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [userHasReported, setUserHasReported] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await api.contests.getSubmissionDetail(id);
        setSubmission(response);
      } catch (error) {
        console.error("Failed to fetch submission:", error);
        toast({
          title: "Error",
          description: "Failed to load submission details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id, toast]);

  useEffect(() => {
    if (submission?.contestId && user) {
      api.contests.getSignupStatus(submission.contestId).then(res => {
        setVotesUsed(res.votesUsed || 0);
      }).catch(console.error);
    }
  }, [submission, user]);

  const handleVoteClick = () => {
    if (!user) {
      router.push(`/login?redirect=/submissions/${id}`);
      return;
    }
    if (submission?.userHasVoted) return;

    if (votesUsed >= 3) {
      toast({
        title: "Hết lượt bình chọn",
        description: "Bạn đã dùng hết 3 lượt bình chọn. Cảm ơn bạn đã tham gia!",
        variant: "destructive"
      });
      return;
    }

    setShowVoteModal(true);
  };

  const handleConfirmVote = async () => {
    if (!turnstileToken) {
      toast({
        title: "Xác thực bảo mật",
        description: "Vui lòng hoàn thành xác thực Turnstile trước khi bình chọn.",
        variant: "destructive"
      });
      return;
    }

    setVoting(true);
    try {
      await api.submissions.vote(id, turnstileToken);

      setSubmission((prev: any) => ({
        ...prev,
        voteCount: (prev.voteCount || 0) + 1,
        userHasVoted: true
      }));

      setShowVoteModal(false);
      setShowSuccessModal(true);
      setVotesUsed(prev => prev + 1);
      setTurnstileToken(""); // Reset token
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Bình chọn thất bại",
        variant: "destructive"
      });
      setShowVoteModal(false);
    } finally {
      setVoting(false);
    }
  };

  const handleReportClick = () => {
    if (!user) {
      router.push(`/login?redirect=/submissions/${id}`);
      return;
    }
    setShowReportModal(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: submission.title,
      text: `Hãy bình chọn cho tác phẩm "${submission.title}" của ${submission.author?.name} tại Cuộc thi Căn Số!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Đã sao chép liên kết",
          description: "Bạn có thể chia sẻ liên kết này với bạn bè.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleConfirmReport = async () => {
    if (!reportReason.trim()) return;
    setIsReporting(true);
    console.log("Starting report process for submission:", id);
    try {
      await api.submissions.report(id, reportReason);
      console.log("Report submitted successfully");
      toast({
        title: "Đã gửi báo cáo",
        description: "Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét trong thời gian sớm nhất.",
      });
      setShowReportModal(false);
      setReportReason("");
      setUserHasReported(true);
    } catch (e: any) {
      console.error("Report submission failed:", e);
      toast({
        title: "Lỗi",
        description: "Không thể gửi báo cáo. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <h2 className="text-xl font-semibold">Bài dự thi không tồn tại</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 text-gray-400 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content (Images) */}
          <div className="lg:col-span-2 space-y-6">
            {submission.media && submission.media.filter((m: any) => m.type === 'IMAGE').length > 0 ? (
              submission.media
                .filter((m: any) => m.type === 'IMAGE')
                .map((media: any) => (
                <div key={media.id} className="bg-black rounded-xl overflow-hidden border border-zinc-800">
                  <div className="relative w-full h-auto min-h-[400px]">
                    <img
                      src={media.url}
                      alt={media.caption || submission.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {media.caption && (
                    <div className="p-4 text-gray-400 text-sm border-t border-zinc-800 bg-zinc-900/50">
                      {media.caption}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center text-gray-500">
                Chưa có hình ảnh minh họa
              </div>
            )}

            <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
              <h2 className="text-xl font-bold mb-4 text-primary">Mô tả tác phẩm</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {submission.description || "Chưa có mô tả cho tác phẩm này."}
              </p>
            </div>
          </div>

          {/* Sidebar (Info & Vote) */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="border-primary text-primary hidden">
                    {submission.categoryName}
                  </Badge>
                </div>
                {submission.entryCode && (
                  <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 rounded-lg border border-zinc-700/50 backdrop-blur-sm">
                    <span className="text-gray-400 text-sm font-medium">Mã bài thi:</span>
                    <span className="text-primary font-mono font-bold text-base">{submission.entryCode}</span>
                  </div>
                )}
                <h1 className="text-3xl font-bold mb-2 leading-tight">{submission.title}</h1>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(submission.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tác giả</p>
                  <p className="font-bold text-lg">{submission.author?.name}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{submission.voteCount}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Lượt bình chọn</p>
                  </div>
                  {/* You can add more stats here like views if available */}
                </div>

                <Button
                  className={`w-full py-6 text-lg font-bold shadow-lg ${submission.userHasVoted
                    ? "bg-green-600 hover:bg-green-700 text-white cursor-default"
                    : "bg-primary hover:bg-primary/90 text-white"
                    }`}
                  onClick={handleVoteClick}
                  disabled={submission.userHasVoted || !submission.isVotable}
                >
                  {submission.userHasVoted ? (
                    <><Check className="mr-2 w-5 h-5" /> Đã bình chọn</>
                  ) : (
                    <><Heart className="mr-2 w-5 h-5 fill-current" /> Bình chọn ngay</>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full border-zinc-700 hover:bg-zinc-800 text-gray-300"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 w-4 h-4" /> Chia sẻ tác phẩm
                </Button>

                <button
                  onClick={handleReportClick}
                  disabled={userHasReported}
                  className={`w-full text-xs flex items-center justify-center gap-1 transition-colors mt-4 ${
                    userHasReported 
                    ? "text-red-500 font-medium cursor-default" 
                    : "text-zinc-500 hover:text-red-500"
                  }`}
                >
                  {userHasReported ? (
                    <><Check className="w-3 h-3" /> Đã gửi báo cáo vi phạm</>
                  ) : (
                    <><Flag className="w-3 h-3" /> Báo cáo vi phạm</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vote Modal */}
      <Dialog open={showVoteModal} onOpenChange={setShowVoteModal}>
        <DialogContent className="sm:max-w-md bg-[#E5D4C8] border-none text-black">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-gray-900">Xác nhận bình chọn</DialogTitle>
            <DialogDescription className="text-center text-gray-700">
              Bạn có chắc chắn muốn bình chọn cho tác phẩm <span className="font-bold">"{submission.title}"</span> không?
              <br /><span className="text-sm text-gray-500 mt-2 block">(Bạn còn {3 - votesUsed} lượt tham gia bình chọn)</span>
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center my-4">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
              onSuccess={(token) => setTurnstileToken(token)}
              options={{
                theme: 'light',
                size: 'normal',
              }}
            />
          </div>

          <DialogFooter className="sm:justify-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowVoteModal(false)}
              className="bg-[#C5B8AD] hover:bg-[#B0A49A] text-white font-semibold"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirmVote}
              disabled={voting}
              className="bg-primary hover:bg-primary/90 text-white font-semibold"
            >
              {voting ? <Loader2 className="animate-spin w-4 h-4" /> : "Đồng ý"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-md bg-zinc-900 border border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" /> Báo cáo vi phạm
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Vui lòng cho chúng tôi biết lý do bạn báo cáo bài dự thi này.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập lý do báo cáo..."
              className="bg-zinc-800 border-zinc-700 text-white focus:ring-red-500 min-h-[100px]"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowReportModal(false)} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              Hủy
            </Button>
            <Button
              onClick={handleConfirmReport}
              disabled={isReporting || !reportReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isReporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gửi báo cáo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-[#E5D4C8] border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Bình chọn thành công</DialogTitle>
            <DialogDescription>Cảm ơn bạn đã tham gia bình chọn cho tác phẩm này.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Bình chọn thành công!</h3>
            <p className="text-gray-700 mt-2 text-center">Cảm ơn bạn đã tham gia bình chọn.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
