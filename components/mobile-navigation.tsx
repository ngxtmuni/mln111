'use client'

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, User as UserIcon, LogOut } from "lucide-react"

const navItems = [
  { href: "/", label: "Trang chủ" },
  { 
    href: "/projects", 
    label: "Dự án",
    submenu: [
      { href: "/events/su-kien-ra-mat-du-an-quang-ba-di-san-thuc-hanh-tin-nguong-tho-mau-tam-phu", label: "Sự kiện Hà Nội" },
      { href: "/events/hanh-trinh-di-san", label: "Sự kiện Huế" },
      { href: "/events/trien-lam-nghe-thuat-can-so", label: "Sự kiện Hồ Chí Minh" },
    ]
  },
  {
    href: "/library",
    label: "Thư viện",
    submenu: [
      { href: "/library/dao-mau", label: "Ứng dụng Đạo Mẫu" },
    ]
  },
  { href: "/contests", label: "Cuộc thi" },
]

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-black/80 backdrop-blur-md text-white border-zinc-800 p-0 pt-10">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu điều hướng</SheetTitle>
          <SheetDescription>
            Truy cập các trang và tính năng của hệ thống
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-grow space-y-2 px-4">
            {navItems.map((item) =>
              item.submenu ? (
                <Accordion key={item.label} type="single" collapsible className="w-full border-b-0">
                  <AccordionItem value={item.label} className="border-b-0">
                    <AccordionTrigger className="py-3 text-base font-medium hover:no-underline">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pb-2 space-y-1">
                      <Link
                        href={item.href}
                        className="block py-2 text-muted-foreground hover:text-white transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Tổng quan
                      </Link>
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="block py-2 text-muted-foreground hover:text-white transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-3 px-4 text-base font-medium transition-colors rounded-lg ${item.href === "/contests"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "hover:text-primary/80"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="p-4 border-t border-zinc-800 space-y-3">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <Badge className="bg-red-600 text-[8px] h-4 px-1 font-bold uppercase border-none text-white">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-white/10">
                      <LayoutDashboard size={18} className="text-primary" />
                      Bảng điều khiển
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-400 hover:text-white hover:bg-red-600/50"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut size={18} />
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 rounded-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/signup" className="block w-full" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary rounded-full">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
