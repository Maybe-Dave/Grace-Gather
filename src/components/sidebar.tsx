"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CalendarDays,
    MessageSquare,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
    },
    {
        label: "Members",
        icon: Users,
        href: "/members",
        color: "text-violet-500",
    },
    {
        label: "Attendance",
        icon: CalendarCheck,
        href: "/attendance",
        color: "text-pink-700",
    },
    {
        label: "Events",
        icon: CalendarDays,
        href: "/events",
        color: "text-orange-700",
    },
    {
        label: "AI Assistant",
        icon: MessageSquare,
        href: "/chat",
        color: "text-emerald-500",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r border-border text-card-foreground">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-4">
                        <Image src="/favicon.ico" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        GraceGather
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                                pathname === route.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2">
                <Link
                    href="/login"
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-destructive hover:bg-destructive/10 rounded-lg transition text-muted-foreground"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-destructive" />
                        Sign Out
                    </div>
                </Link>
            </div>
        </div>
    )
}
