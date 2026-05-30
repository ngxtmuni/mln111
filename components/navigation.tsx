'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { ChevronDown, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import MobileNavigation from "./mobile-navigation"
import { useAuth } from "@/components/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

type NavSubItem = {
  href: string
  label: string
}

type NavItem = {
  href: string
  label: string
  button?: boolean
  submenu?: NavSubItem[]
}

const navItems: NavItem[] = [
  { href: "/", label: "Trang chủ" },
  { href: "/news", label: "Tin tức" },
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
  { href: "/community", label: "Cộng đồng" },
  { href: "/contests", label: "Cuộc thi", button: true },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Hide navigation on immersive flows
  if (pathname?.startsWith('/judging') || pathname?.startsWith('/exhibition/canso')) {
    return null
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
      <div
        className={`w-full max-w-6xl border rounded-full transition-all duration-300 ${scrolled
          ? "border-white/20 bg-black/30 backdrop-blur-sm shadow-lg"
          : "border-transparent bg-black/50"
          }`}
      >
        <div className="flex justify-between items-center px-6 py-1">
          <Link href="/" className="flex items-center flex-shrink-0 ml-2">
            <Image 
              src="/Logo-02.png" 
              alt="Kết nối di sản Logo" 
              width={120} 
              height={120} 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => {
              const isActive = item.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.href)

              return (
                <div key={item.href || item.label} className="relative group">
                  {item.button ? (
                    <Link href={item.href}>
                      <Button size="sm" className={`w-full rounded-full transition-colors ${
                        isActive 
                        ? "bg-primary text-white hover:bg-primary/90" 
                        : "bg-gradient-to-r from-primary to-white text-black hover:from-primary hover:to-gray-100"
                      }`}>
                        {item.label}
                      </Button>
                    </Link>
                  ) : (
                    <button className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 relative ${
                      isActive ? "text-[#393ADD]" : "text-white hover:text-[#393ADD]/80"
                    }`}>
                      <Link href={item.href || "#"} className="flex items-center gap-1">
                        {item.label}
                        {item.submenu && <ChevronDown size={16} />}
                      </Link>
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-[#393ADD] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}></span>
                    </button>
                  )}

                  {item.submenu && (
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 mt-2 w-48 border border-zinc-800 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 top-full bg-black/80 backdrop-blur-md shadow-lg`}
                    >
                      <div className="py-1">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.href}
                            href={subitem.href}
                            className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-auto flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white/10 transition-colors">
                    <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary transition-all">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    {user.role === 'admin' && (
                      <Badge className="bg-red-600 hover:bg-red-700 text-[10px] h-5 px-1.5 font-bold uppercase border-none text-white shadow-lg shadow-red-900/20">
                        Admin
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/90 backdrop-blur-md border-zinc-800 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal p-0">
                    <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} className="flex flex-col space-y-1 p-3 cursor-pointer hover:bg-white/10 transition-colors rounded-sm">
                      <p className="text-sm font-bold leading-none text-white">{user.name}</p>
                      <p className="text-xs leading-none text-zinc-400">
                        {user.email}
                      </p>
                    </Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem asChild>
                    <Link href={user.role === 'admin' ? "/admin" : "/dashboard"} className="w-full cursor-pointer flex items-center py-2 hover:bg-white/10 focus:bg-white/10">
                      <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                      <span>Bảng điều khiển</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-400 focus:text-white focus:bg-red-600/50 py-2 flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 rounded-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/signup">
                  <div className="p-[1px] rounded-full bg-gradient-to-bl from-white via-black to-primary">
                    <Button size="sm" className="w-full bg-black hover:bg-zinc-900 text-white rounded-full transition-colors">
                      Đăng ký
                    </Button>
                  </div>
                </Link>
              </>
            )}
          </div>

          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
