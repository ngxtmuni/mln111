"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { Loader2, Eye, FileText, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function AdminContestsPage() {
  const [contests, setContests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchContests = async () => {
      try {
        // Fetch all contests without pagination for now to see list
        const response = await api.contests.getAll({ limit: 100 })
        setContests(response.items || [])
      } catch (error) {
        console.error("Failed to fetch contests:", error)
        toast({
            title: "Error",
            description: "Failed to load contests",
            variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchContests()
  }, [toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>
      case 'open_submit':
      case 'submit_open':
        return <Badge variant="default" className="bg-green-600">Submissions Open</Badge>
      case 'open_vote':
      case 'vote_open':
        return <Badge variant="secondary" className="bg-cyan-100 text-cyan-700">Voting Open</Badge>
      case 'ended':
      case 'completed':
        return <Badge variant="secondary">Ended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Cuộc thi</h1>
          <p className="text-muted-foreground">Xem và quản lý tất cả các cuộc thi trên hệ thống</p>
        </div>
        {/* <Button className="bg-gradient-to-r from-primary-500 to-red-600">
           <Trophy className="mr-2 h-4 w-4" /> Tạo cuộc thi mới
        </Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách cuộc thi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Chưa có cuộc thi nào được tạo.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Tên cuộc thi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thời gian nộp bài</TableHead>
                  <TableHead>Thời gian bình chọn</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contests.map((contest) => (
                  <TableRow key={contest.id}>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                            <span>{contest.title}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[250px]">{contest.description}</span>
                        </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(contest.status)}</TableCell>
                    <TableCell>
                        <div className="text-xs">
                            <p>Mở: {contest.submitOpenAt ? format(new Date(contest.submitOpenAt), 'dd/MM/yyyy') : 'TBA'}</p>
                            <p>Đóng: {contest.submitCloseAt ? format(new Date(contest.submitCloseAt), 'dd/MM/yyyy') : 'TBA'}</p>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="text-xs">
                            <p>Mở: {contest.voteOpenAt ? format(new Date(contest.voteOpenAt), 'dd/MM/yyyy') : 'TBA'}</p>
                            <p>Đóng: {contest.voteCloseAt ? format(new Date(contest.voteCloseAt), 'dd/MM/yyyy') : 'TBA'}</p>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/submissions?contestId=${contest.id}`}>
                                <FileText className="h-4 w-4 mr-1" />
                                Bài thi
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/users?contestId=${contest.id}`}>
                                <Users className="h-4 w-4 mr-1" />
                                Đăng ký
                            </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
