"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
    }
  }, [user])

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    try {
      await api.auth.updateProfile({ name, bio })
      await refreshUser()
      toast.success("Cập nhật hồ sơ thành công")
    } catch (error: any) {
      toast.error("Cập nhật thất bại: " + error.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-primary mb-8">Cài đặt</h1>

      {/* Profile Settings */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Thông tin hồ sơ</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ""}
              disabled
              className="w-full px-4 py-2 border border-input rounded-lg bg-zinc-100 text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tiểu sử</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tôi yêu thích di sản văn hóa Việt Nam"
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleUpdateProfile}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-500 mb-1">Vùng nguy hiểm</h2>
            <p className="text-sm text-muted-foreground">Các hành động này không thể hoàn tác</p>
          </div>
          <Button variant="destructive">Xóa tài khoản</Button>
        </div>
      </Card>
    </div>
  )
}
