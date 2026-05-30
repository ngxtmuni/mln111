"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertTriangle, Check, Eye, X } from "lucide-react"
import Link from "next/link"

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [targetType, setTargetType] = useState<"submission" | "community_post">("submission")
  const { toast } = useToast()

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.admin.reports.getPending({ page: 0, limit: 100, targetType });
      const reportList = data.content || data.items || data || [];
      setReports(Array.isArray(reportList) ? reportList : []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách báo cáo. Vui lòng kiểm tra quyền Admin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [targetType]);

  const handleResolve = async (reportId: string, status: string) => {
    try {
      await api.admin.reports.resolve(reportId, status);
      toast({
        title: "Thành công",
        description: status === 'resolved' ? "Đã xử lý vi phạm" : "Đã bỏ qua báo cáo",
      });
      fetchReports();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Xử lý báo cáo thất bại",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Báo cáo</h1>
          <p className="text-muted-foreground">Xem các nội dung bị báo cáo vi phạm</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={targetType === "submission" ? "default" : "outline"} 
          onClick={() => setTargetType("submission")}
        >
          Bài Dự Thi
        </Button>
        <Button 
          variant={targetType === "community_post" ? "default" : "outline"} 
          onClick={() => setTargetType("community_post")}
        >
          Bài Viết Cộng Đồng
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Check className="h-10 w-10 mb-2 text-green-500" />
                <p>Hiện không có báo cáo nào chưa xử lý ở mục này.</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="overflow-hidden border-red-200 dark:border-red-900/50">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-semibold text-red-500 uppercase tracking-wider">
                        Lý do: {report.reason}
                      </span>
                      <Badge variant="outline" className="ml-auto">
                        {new Date(report.createdAt).toLocaleString("vi-VN")}
                      </Badge>
                    </div>
                    
                    <div>
                      {report.targetType === "community_post" ? (
                        <>
                          <h3 className="font-bold text-lg">
                            Bài cộng đồng: <span className="text-primary">{report.communityPostTitle || "Không rõ"}</span>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Người đăng bài: {report.communityPostAuthorName || "Không rõ"}
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="font-bold text-lg">
                            Bài thi: <span className="text-primary">{report.submissionTitle || "Không rõ"}</span>
                          </h3>
                          {report.contestTitle && (
                            <p className="text-xs text-zinc-500 mt-1">Cuộc thi: {report.contestTitle}</p>
                          )}
                        </>
                      )}
                      <p className="text-sm text-muted-foreground mt-2 border-t pt-2">
                        Người báo cáo: {report.reporterName || "Ẩn danh"} ({report.reporterEmail})
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-6 flex flex-col md:flex-row items-center justify-center gap-2 border-t md:border-t-0 md:border-l">
                    {report.targetType === "community_post" && report.communityPostId && (
                      <Link href={`/community?post=${report.communityPostId}`} target="_blank">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" /> Xem Bài
                        </Button>
                      </Link>
                    )}
                    {report.targetType !== "community_post" && report.submissionId && (
                      <Link href={`/admin/submissions/${report.submissionId}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="mr-2 h-4 w-4" /> Chi tiết
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 w-full"
                      onClick={() => handleResolve(report.id, 'dismissed')}
                    >
                      <Check className="mr-2 h-4 w-4" /> Bỏ qua
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="w-full"
                      onClick={() => handleResolve(report.id, 'resolved')}
                    >
                      <X className="mr-2 h-4 w-4" /> Ẩn bài / Xác nhận
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
