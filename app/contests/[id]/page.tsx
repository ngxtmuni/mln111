"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, Contest } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trophy, FileText, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import ContestResults from "../components/ContestResults";

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const id = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signupStatus, setSignupStatus] = useState<{ isSignedUp: boolean; status: string | null }>({ isSignedUp: false, status: null });
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestRes, categoriesRes] = await Promise.all([
          api.contests.getById(id),
          api.contests.getCategories(id)
        ]);
        setContest(contestRes);
        setCategories(categoriesRes);

        // Check signup status if logged in
        if (user) {
            try {
                const statusRes = await api.contests.getSignupStatus(id);
                setSignupStatus(statusRes);
            } catch (ignore) {
                // Ignore if check fails (e.g. 401 handled by api wrapper?)
            }
        }
      } catch (error) {
        console.error("Failed to load contest details", error);
        toast({
            title: "Error",
            description: "Failed to load contest details",
            variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, user, toast]);

  const handleJoin = async () => {
    if (!user) {
        router.push(`/login?redirect=/contests/${id}`);
        return;
    }

    setJoining(true);
    try {
        await api.contests.signup(id);
        toast({
            title: "Success",
            description: "Đăng ký tham gia thành công!",
        });
        // Refresh status
        const statusRes = await api.contests.getSignupStatus(id);
        setSignupStatus(statusRes);
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Đăng ký thất bại",
            variant: "destructive"
        });
    } finally {
        setJoining(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  if (!contest) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
            <h1 className="text-2xl font-bold">Không tìm thấy cuộc thi</h1>
            <Button variant="outline" onClick={() => router.back()} className="text-white border-white hover:bg-white hover:text-black">
                <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
            </Button>
        </div>
    );
  }

  const isSubmitOpen = contest.status === 'OPEN';
  const showResults = Boolean((contest as any).voteCloseAt) && new Date() >= new Date((contest as any).voteCloseAt);
  
  return (
    <div className="min-h-screen bg-black text-white pt-20">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full overflow-hidden">
            {contest.coverImageUrl ? ( 
                 <img 
                 src={contest.coverImageUrl} 
                 alt={contest.title} 
                 className="w-full h-full object-cover opacity-60"
             />
            ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary-900 to-black opacity-60" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
                <div className="max-w-6xl mx-auto">
                    <Button variant="ghost" onClick={() => router.back()} className="text-gray-300 hover:text-white mb-4 pl-0 hover:bg-transparent">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                    </Button>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <Badge variant={isSubmitOpen ? "default" : "secondary"} className="bg-primary hover:bg-primary/90 text-base py-1 px-4">
                            {isSubmitOpen ? "Đang nhận bài thi" : contest.status}
                        </Badge>
                        {signupStatus.isSignedUp && (
                            <Badge variant="outline" className="border-green-500 text-green-500 text-base py-1 px-4 flex gap-1 items-center">
                                <CheckCircle className="w-4 h-4" /> Đã đăng ký
                            </Badge>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{contest.title}</h1>
                    <p className="text-xl text-gray-300 max-w-3xl">{contest.description}</p>
                </div>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
                {/* Rules */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">Thể lệ cuộc thi</h2>
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <ReactMarkdown>{(contest as any).rules || "Chi tiết thể lệ đang được cập nhật..."}</ReactMarkdown>
                    </div>
                </section>

                {/* Prizes */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Giải thưởng</h2>
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-300 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                        <ReactMarkdown>{(contest as any).prizes || "Thông tin giải thưởng đang được cập nhật..."}</ReactMarkdown>
                    </div>
                </section>

                {/* Categories */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold">Hạng mục dự thi</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg">
                                <h3 className="font-bold text-lg mb-2 text-white">{cat.name}</h3>
                                <p className="text-sm text-gray-400">{cat.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Timeline Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" /> Mốc thời gian
                    </h3>
                    
                    <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-zinc-800">
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-600" />
                            <p className="text-sm text-gray-400 mb-1">Mở đăng ký & Nộp bài</p>
                            <p className="font-medium text-white">
                                {(contest as any).submitOpenAt ? format(new Date((contest as any).submitOpenAt), "dd/MM/yyyy") : "TBA"}
                            </p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-2 border-primary-300 shadow-[0_0_10px_rgba(57,58,221,0.5)]" />
                            <p className="text-sm text-gray-400 mb-1">Đóng nộp bài</p>
                            <p className="font-medium text-white">
                                {(contest as any).submitCloseAt ? format(new Date((contest as any).submitCloseAt), "dd/MM/yyyy") : "TBA"}
                            </p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-600" />
                            <p className="text-sm text-gray-400 mb-1">Mở bình chọn</p>
                            <p className="font-medium text-white">
                                {(contest as any).voteOpenAt ? format(new Date((contest as any).voteOpenAt), "dd/MM/yyyy") : "TBA"}
                            </p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-zinc-800 border-2 border-zinc-600" />
                            <p className="text-sm text-gray-400 mb-1">Công bố kết quả</p>
                            <p className="font-medium text-white">
                                {(contest as any).voteCloseAt ? format(new Date((contest as any).voteCloseAt), "dd/MM/yyyy") : "TBA"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-800">
                        {!user ? (
                             <Button className="w-full bg-primary hover:bg-primary/90 font-bold py-6 text-lg" onClick={() => router.push(`/login?redirect=/contests/${id}`)}>
                                Đăng nhập để tham gia
                             </Button>
                        ) : signupStatus.isSignedUp ? (
                             <Button className="w-full bg-green-600 hover:bg-green-700 font-bold py-6 text-lg" onClick={() => router.push('/contests/submit')}>
                                Nộp bài dự thi ngay
                             </Button>
                        ) : (
                            <Button 
                                className="w-full bg-primary hover:bg-primary/90 font-bold py-6 text-lg" 
                                onClick={handleJoin}
                                disabled={joining || !isSubmitOpen}
                            >
                                {joining ? <Loader2 className="animate-spin mr-2" /> : null}
                                {isSubmitOpen ? "Đăng ký tham gia" : "Đã đóng đăng ký"}
                            </Button>
                        )}
                        
                        {signupStatus.status === 'pending' && (
                            <div className="mt-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-lg flex items-start gap-2 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Đăng ký của bạn đang chờ phê duyệt. Bạn sẽ nhận được thông báo khi được chấp nhận.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {showResults && (
            <div className="max-w-6xl mx-auto px-4 pb-16">
                <ContestResults contestId={id} />
            </div>
        )}
    </div>
  );
}
