"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, FileText, Users, Trophy, ArrowRight, Activity, Calendar, ShieldCheck, Settings, Bell, Loader2, AlertTriangle, Star, Image as ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import Link from "next/link"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [contestCount, setContestCount] = useState<number | null>(null)
  const [reportCount, setReportCount] = useState<number | null>(null)
  const [judgingProgress, setJudgingProgress] = useState<{ scored: number, total: number } | null>(null)
  
  const CONTEST_ID = "1740a8d0-988e-4d6e-84a2-ee8b01f2a5f3";

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const contestsRes = await api.contests.getAll({ limit: 100 })
            const contests = contestsRes.items || []
            setContestCount(contests.length)

            // Fetch judging progress
            try {
              const progress = await api.judging.getAdminProgress(CONTEST_ID);
              if (progress) {
                setJudgingProgress({ 
                  scored: progress.totalScored || 0, 
                  total: progress.totalSubmissions || 0 
                });
              }
            } catch (err) {
              console.error("Failed to fetch judging progress", err);
            }

            if (contests.length > 0) {
                let totalPending = 0
                for (const contest of contests) {
                    const subs = await api.admin.submissions.getAll({ 
                        contestId: contest.id, 
                        status: 'pending', 
                        limit: 1 
                    })
                    totalPending += subs.totalItems || 0
                }
                setPendingCount(totalPending)
            } else {
                setPendingCount(0)
            }

            // Fetch report count
            try {
                const count = await api.admin.reports.getPendingCount()
                setReportCount(count)
            } catch (err) {
                console.error("Failed to fetch report count", err)
                setReportCount(0)
            }

        } catch (e) {
            console.error("Failed to fetch admin stats", e)
        }
    }
    fetchStats()
  }, [])
  
  const stats = [
    { label: "Người dùng", value: "Sắp ra mắt", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Bài thi chờ duyệt", value: pendingCount !== null ? pendingCount : <Loader2 className="animate-spin h-6 w-6"/>, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Cuộc thi đang chạy", value: contestCount !== null ? contestCount : <Loader2 className="animate-spin h-6 w-6"/>, icon: Trophy, color: "text-primary-500", bg: "bg-primary-500/10" },
    { label: "Báo cáo chờ xử lý", value: reportCount !== null ? reportCount : <Loader2 className="animate-spin h-6 w-6"/>, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Tiến độ Chấm bài", value: judgingProgress !== null ? `${judgingProgress.scored}/${judgingProgress.total}` : <Loader2 className="animate-spin h-6 w-6"/>, icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  ]

  const recentAdminActivity = [
    { id: 1, action: "Hệ thống", title: "Khởi động thành công", date: "Vừa xong", icon: Settings, color: "text-blue-500" },
  ]

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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-red-600">
              Quản trị hệ thống
            </h1>
            <p className="text-muted-foreground mt-1">Xin chào {user?.name || "Admin"}, chào mừng bạn trở lại bảng điều khiển.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2">
                <Settings size={18} />
                Cài đặt
             </Button>
             <Button className="bg-gradient-to-r from-red-600 to-primary-600 hover:from-red-700 hover:to-primary-700 shadow-lg shadow-red-500/20">
                Thông báo mới
             </Button>
          </div>
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
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-red-600 group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
                      <div className="text-3xl font-bold text-foreground group-hover:text-red-600 transition-colors">{stat.value}</div>
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
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="h-full overflow-hidden border-zinc-200/50 dark:border-zinc-800">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="text-red-600 w-5 h-5" />
                  <h2 className="text-xl font-bold">Hoạt động quản trị</h2>
                </div>
                {/* <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600">
                  Nhật ký hệ thống
                </Button> */}
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recentAdminActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-6 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <div className={`p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 ${activity.color}`}>
                      <activity.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {activity.action} <span className="font-bold text-red-600">"{activity.title}"</span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {activity.date}
                      </p>
                    </div>
                    {/* <Button variant="ghost" size="icon" className="rounded-full">
                      <ArrowRight size={16} className="text-muted-foreground" />
                    </Button> */}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full border-zinc-200/50 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                Quản lý nhanh
              </h2>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-transparent" asChild>
                  <Link href="/admin/contests">
                    <ShieldCheck size={18} />
                    Phê duyệt bài đăng
                  </Link>
                </Button>
                <div className="relative group">
                  <Button variant="outline" disabled className="w-full justify-start gap-2 opacity-60">
                    <Users size={18} />
                    Quản lý người dùng
                  </Button>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-red-500 uppercase">Sắp ra mắt</span>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all" asChild>
                  <Link href="/admin/contests">
                    <Trophy size={18} />
                    Cài đặt cuộc thi
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-amber-600/10 hover:text-amber-600 border-dashed transition-all" asChild>
                  <Link href="/admin/judging">
                    <Star size={18} className="text-amber-500" />
                    Quản lý Chấm điểm
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-[#393ADD]/10 hover:text-[#393ADD] border-dashed transition-all" asChild>
                  <Link href="/admin/exhibition">
                    <ImageIcon size={18} className="text-[#393ADD]" />
                    Quản lý Exhibition
                  </Link>
                </Button>
                {/* <Button variant="outline" className="w-full justify-start gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <Bell size={18} />
                  Gửi thông báo hệ thống
                </Button> */}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-primary-500/10 border border-red-200 dark:border-red-900/30">
                <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Trạng thái hệ thống</h3>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs">
                      <span>Server Status:</span>
                      <span className="text-emerald-500 font-bold">Online</span>
                   </div>
                   <div className="flex justify-between text-xs">
                      <span>Database:</span>
                      <span className="text-emerald-500 font-bold">Stable</span>
                   </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
