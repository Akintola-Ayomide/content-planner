"use client"

import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduled: 0,
    ideas: 0,
    channels: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        // These endpoints should exist in the backend
        const content = await api.get('/content')
        const ideas = await api.get('/ideas')
        
        setStats({
          totalPosts: content.length || 0,
          scheduled: content.filter((p: any) => p.status === 'scheduled').length || 0,
          ideas: ideas.length || 0,
          channels: 0 // Placeholder for now
        })
      } catch (error) {
        console.error('Failed to fetch stats', error)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'User'}!</h1>
        <p className="text-muted-foreground mt-2">Here&apos;s what&apos;s happening with your content</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">All posts created</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground mt-1">Posts scheduled</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.ideas}</div>
            <p className="text-xs text-muted-foreground mt-1">AI-generated ideas</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.channels}</div>
            <p className="text-xs text-muted-foreground mt-1">Connected channels</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect your channels</h3>
              <p className="text-muted-foreground mt-1">Start by connecting your social media accounts to sync your audience.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold">Generate content ideas with AI</h3>
              <p className="text-muted-foreground mt-1">
                Use our AI engine to brainstorm and create your next viral piece of content.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold">Schedule and publish</h3>
              <p className="text-muted-foreground mt-1">Plan your content calendar and publish across all platforms at once.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
