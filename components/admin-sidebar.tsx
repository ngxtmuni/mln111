"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LayoutDashboard, FileText, Settings, Users, Trophy, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function AdminSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Optional: Load preference from local storage
    useEffect(() => {
        const saved = localStorage.getItem('admin-sidebar-collapsed')
        if (saved) setIsCollapsed(saved === 'true')
    }, [])

    const toggleCollapse = () => {
        const newState = !isCollapsed
        setIsCollapsed(newState)
        localStorage.setItem('admin-sidebar-collapsed', String(newState))
    }

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/admin",
            active: pathname === "/admin",
        },
        {
            label: "Contests",
            icon: Trophy,
            href: "/admin/contests",
            active: pathname.startsWith("/admin/contests"),
        },
        {
            label: "Reports",
            icon: AlertTriangle,
            href: "/admin/reports",
            active: pathname.startsWith("/admin/reports"),
        },
        {
            label: "News",
            icon: FileText,
            href: "/admin/news",
            active: pathname.startsWith("/admin/news"),
        },
        {
            label: "Users",
            icon: Users,
            href: "/admin/users",
            active: pathname.startsWith("/admin/users"),
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/admin/settings",
            active: pathname.startsWith("/admin/settings"),
        },
    ]

    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="md:hidden fixed left-4 top-4 z-40">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Admin Navigation</SheetTitle>
                        <SheetDescription>
                            Quick access to administration tools and settings
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                        <div className="px-3 py-2">
                            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                                Admin Portal
                            </h2>
                            <div className="space-y-1">
                                {routes.map((route) => (
                                    <Button
                                        key={route.href}
                                        variant={route.active ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        asChild
                                        onClick={() => setOpen(false)}
                                    >
                                        <Link href={route.href}>
                                            <route.icon className="mr-2 h-4 w-4" />
                                            {route.label}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            
            <div 
                className={cn(
                    "hidden border-r bg-background md:block transition-all duration-300 relative",
                    isCollapsed ? "w-20" : "w-72",
                    className
                )}
            >
                <div className="space-y-4 py-4 h-full flex flex-col">
                    <div className="px-3 py-2 flex-1">
                        <div className={cn("flex items-center mb-4 px-4", isCollapsed ? "justify-center" : "justify-between")}>
                            {!isCollapsed && (
                                <h2 className="text-lg font-semibold tracking-tight">
                                    Admin Portal
                                </h2>
                            )}
                            <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8" 
                                onClick={toggleCollapse}
                                title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                            >
                                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <Button
                                    key={route.href}
                                    variant={route.active ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full transition-all",
                                        isCollapsed ? "justify-center p-0" : "justify-start"
                                    )}
                                    asChild
                                    title={isCollapsed ? route.label : ""}
                                >
                                    <Link href={route.href}>
                                        <route.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                                        {!isCollapsed && route.label}
                                    </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
