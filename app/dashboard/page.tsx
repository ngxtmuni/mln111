"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, FileText, Users, Trophy, ArrowRight, Activity, Calendar, Bell, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

export default function DashboardPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Add state for stats
  const [votesRemaining, setVotesRemaining] = useState<number | string>("...");
  const [submissionCount, setSubmissionCount] = useState<number | string>("...");
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [myVotedSubmissions, setMyVotedSubmissions] = useState<any[]>([]);

  const stats = [
    { label: "Lượt bình chọn còn lại", value: votesRemaining, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Bài dự thi", value: submissionCount, icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  ]

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.notifications.getAll({ limit: 5 })
        setNotifications(res.content || [])
      } catch (error) {
        console.error("Failed to fetch notifications", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Fetch first contest to get signup status/votes
        const contestsRes = await api.contests.getAll({ limit: 1 });
        if (contestsRes.items && contestsRes.items.length > 0) {
          const contestId = contestsRes.items[0].id;
          const status = await api.contests.getSignupStatus(contestId);
          setVotesRemaining(3 - (status.votesUsed || 0));

          const mySubs = await api.contests.getMySubmissions(contestId);
          setMySubmissions(mySubs || []);
          setSubmissionCount((mySubs || []).length);

          const myVotedSubs = await api.contests.getMyVotedSubmissions(contestId);
          setMyVotedSubmissions(myVotedSubs || []);
        } else {
          setVotesRemaining(3);
          setSubmissionCount(0);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
        setVotesRemaining(0);
        setSubmissionCount(0);
      }
    }
    fetchStats();
  }, [user]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const getFirstName = (fullName: string | undefined | null) => {
    if (!fullName) return null
    const parts = fullName.trim().split(/\s+/)
    return parts[parts.length - 1]
  }

  const displayName = getFirstName(user?.name) || user?.email || "Bạn"

  const getNotificationIcon = (type: string) => {
    if (type.includes("APPROVED")) return CheckCircle
    if (type.includes("REJECTED")) return XCircle
    return Bell
  }

  const getNotificationColor = (type: string) => {
    if (type.includes("APPROVED")) return "text-green-500"
    if (type.includes("REJECTED")) return "text-red-500"
    return "text-blue-500"
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-500">
              Xin chào, {displayName}!
            </h1>
            <p className="text-muted-foreground mt-1">Chào mừng trở lại Thờ Mẫu Tam, hôm nay bạn có gì mới?</p>
          </div>
          <Button className="bg-gradient-to-r from-primary-500 to-red-600 hover:from-primary-600 hover:to-red-700 shadow-lg shadow-primary-500/20">
            Tạo bài viết mới
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} variants={item}>
                <Card className="p-6 opacity-75 hover:opacity-100 transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary group relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
                      <div className="flex flex-col">
                        <p className="text-2xl font-bold text-foreground transition-colors">{stat.value}</p>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity (Now Notifications) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full overflow-hidden border-zinc-200/50 dark:border-zinc-800">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="text-primary w-5 h-5" />
                  <h2 className="text-xl font-bold">Thông báo mới nhất</h2>
                </div>
                {/* <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  Xem tất cả
                </Button> */}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <div className="p-6 text-center text-muted-foreground">Đang tải...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">Bạn chưa có thông báo nào.</div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = getNotificationIcon(notif.type)
                    const color = getNotificationColor(notif.type)

                    return (
                      <div
                        key={notif.id}
                        className={`p-6 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${!notif.isRead ? 'bg-primary-50/5 dark:bg-primary-900/10' : ''}`}
                      >
                        <div className={`p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 mt-1 ${color}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {notif.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5 break-words">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                            <Calendar size={12} />
                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: vi })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions / Submissions display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <Card className="border-zinc-200/50 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Bài dự thi của bạn
              </h2>
              <div className="space-y-4">
                {mySubmissions.length === 0 ? (
                  <div className="text-sm text-muted-foreground bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg text-center">
                    Bạn chưa có bài dự thi nào.
                  </div>
                ) : (
                  mySubmissions.map((sub: any) => (
                    <div key={sub.id} className="flex gap-4 p-4 rounded-xl items-center bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 hover:border-primary/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate" title={sub.title}>{sub.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sub.description}</p>
                      </div>
                      <div className="flex flex-col items-center justify-center min-w-[60px] p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-100 dark:border-zinc-700">
                        <Heart className="w-4 h-4 text-rose-500 mb-1" />
                        <span className="text-sm font-bold text-foreground">{sub.voteCount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="border-zinc-200/50 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-rose-500 rounded-full"></span>
                Các bài đã bình chọn
              </h2>
              <div className="space-y-4">
                {myVotedSubmissions.length === 0 ? (
                  <div className="text-sm text-muted-foreground bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg text-center">
                    Bạn chưa bình chọn cho bài thi nào.
                  </div>
                ) : (
                  myVotedSubmissions.map((sub: any) => (
                    <div key={sub.id} className="flex items-start gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 group relative">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100">
                        {sub.media && sub.media.length > 0 ? (
                          <img src={sub.media[0].url} alt={sub.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-zinc-400">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors" title={sub.title}>
                          {sub.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{sub.author?.name || "Tác giả ẩn danh"}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-500/10 w-fit px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Đã bình chọn
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => window.open(`/submissions/${sub.id}`, '_self')}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
