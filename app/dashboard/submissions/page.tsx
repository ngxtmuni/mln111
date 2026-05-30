"use client"

import { useEffect, useState } from "react"
import { FileText, Loader2, Edit3, Eye, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [contests, setContests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all contests first to find user's submissions in them
        const contestsRes = await api.contests.getAll({ limit: 50 })
        const contestItems = contestsRes.items || []
        setContests(contestItems)

        // For each contest, check if user has submissions
        // Since we only expect 1-2 contests for now, this is okay
        const submissionPromises = contestItems.map((c: any) => 
          api.contests.getMySubmissions(c.id).catch(() => [])
        )
        
        const results = await Promise.all(submissionPromises)
        const allMySubmissions = results.flat()
        setSubmissions(allMySubmissions)
      } catch (error) {
        console.error("Failed to fetch submissions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-primary/10 p-6 rounded-full mb-6"
        >
          <FileText className="w-16 h-16 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-4">Chưa có bài dự thi</h1>
        <p className="text-muted-foreground max-w-md text-lg mb-8">
          Bạn chưa tham gia nộp bài cho cuộc thi nào. Hãy khám phá các cuộc thi đang diễn ra nhé!
        </p>
        <Link href="/contests">
          <Button size="lg">Xem các cuộc thi</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bài dự thi của tôi</h1>
        <p className="text-muted-foreground">Theo dõi trạng thái và quản lý các bài thi bạn đã nộp.</p>
      </div>

      <div className="grid gap-6">
        {submissions.map((sub) => (
          <Card key={sub.id} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail */}
              <div className="w-full md:w-64 h-48 relative bg-zinc-100 dark:bg-zinc-900">
                {sub.thumbnailUrl ? (
                  <Image 
                    src={sub.thumbnailUrl} 
                    alt={sub.title} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <FileText className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 hidden">
                    {sub.categoryName}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {sub.status === 'approved' && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" /> Đã duyệt
                      </Badge>
                    )}
                    {sub.status === 'pending' && (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
                        <Clock className="w-3 h-3 mr-1" /> Chờ phê duyệt
                      </Badge>
                    )}
                    {sub.status === 'rejected' && (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" /> Bị từ chối
                      </Badge>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{sub.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1">
                  {sub.description || "Không có mô tả"}
                </p>

                {sub.status === 'rejected' && sub.rejectReason && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700 dark:text-red-400">Lý do từ chối:</p>
                      <p className="text-sm text-red-600 dark:text-red-300 italic">"{sub.rejectReason}"</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-auto">
                  <Link href={`/submissions/${sub.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" /> Xem bài thi
                    </Button>
                  </Link>
                  {(sub.status === 'pending' || sub.status === 'rejected') && (
                    <Link href={`/contests/edit/${sub.id}`}>
                      <Button size="sm" className="bg-primary text-white">
                        <Edit3 className="w-4 h-4 mr-2" /> Chỉnh sửa
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
