"use client"

import Link from "next/link"
import { BarChart3, Calendar, Lightbulb, Settings, BookOpen, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/dashboard/content", label: "Content", icon: BookOpen },
]

export function DashboardSidebar({ user }: { user: any }) {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    logout()
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">ContentPilot</h1>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground hover:translate-x-1"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-border space-y-3">
        <Link href="/dashboard/settings">
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10 hover:text-primary">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="w-5 h-5" />
          <span>{isLoading ? "Logging out..." : "Logout"}</span>
        </Button>
      </div>
    </div>
  )
}
