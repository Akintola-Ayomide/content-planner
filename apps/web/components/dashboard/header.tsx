"use client"

import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            type="text" 
            placeholder="Search content, ideas..." 
            className="pl-10 h-9 bg-background/50 border-primary/10 focus:border-primary/30 transition-all rounded-xl" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">
            {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-tight">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground leading-tight">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
