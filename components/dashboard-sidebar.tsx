"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Heart, FileText, Settings, LogOut, MessageSquare, Users } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const menuItems = [
    { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    ...(user?.role?.toLowerCase() === 'admin' ? [{ href: "/dashboard/news", label: "Quản lý Tin tức", icon: FileText }] : []),
    { href: "/dashboard/favorites", label: "Yêu thích", icon: Heart },
    { href: "/dashboard/submissions", label: "Bài dự thi", icon: FileText },
    { href: "/dashboard/community", label: "Cộng đồng", icon: Users },
    { href: "/dashboard/messages", label: "Tin nhắn", icon: MessageSquare },
    { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
  ]

  return (
    <aside className="w-64 hidden lg:block border-r border-border h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto bg-card/50 backdrop-blur-sm">
      <div className="p-4 space-y-2">
        <div className="px-4 py-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </h2>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 relative overflow-hidden transition-all duration-300 ${isActive
                    ? "text-primary bg-primary/10 hover:bg-primary/20 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <Icon size={18} />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <div className="px-4 py-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tài khoản
            </h2>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut size={18} />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
