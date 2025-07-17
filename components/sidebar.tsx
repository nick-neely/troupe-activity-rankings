"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Upload, BarChart3, Settings, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Upload Data", href: "/admin", icon: Upload },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Trends", href: "/trends", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-72 bg-white border-r border-slate-200 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Troupe Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">Trip Activity Analytics</p>
      </div>

      <nav className="space-y-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
