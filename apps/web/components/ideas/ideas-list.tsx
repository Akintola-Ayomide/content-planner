"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { api } from "@/lib/api-client"
import { Calendar, Tag, Type, MessageSquare, ArrowRight } from "lucide-react"

interface Idea {
  id: string
  title: string
  description: string
  contentType: string
  category: string
  tone: string
  createdAt: string
}

interface IdeasListProps {
  refreshKey?: number
}

export function IdeasList({ refreshKey = 0 }: IdeasListProps) {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true)
      try {
        const data = await api.get("/ideas")
        setIdeas(data || [])
      } catch (error) {
        console.error("Error fetching ideas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [refreshKey])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-primary/5">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 border-2 border-dashed border-primary/10 rounded-2xl bg-card/30">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
          <MessageSquare className="w-8 h-8 text-primary/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No ideas yet</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-1">
          Your AI-generated content ideas will appear here. Start by using the generator above!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {ideas.map((idea) => (
        <Card key={idea.id} className="group hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                {idea.title}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/10">
                <Type className="w-3 h-3" />
                {idea.contentType.replace('-', ' ')}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary-foreground px-2.5 py-1 rounded-full border border-secondary/10">
                <Tag className="w-3 h-3" />
                {idea.category}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {idea.description}
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-primary/5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(idea.createdAt), "MMM d, yyyy")}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold hover:bg-primary/5 rounded-lg group/btn">
                  View Full
                  <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
                <Button size="sm" className="h-8 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 shadow-sm transition-all hover:scale-[1.02]">
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
