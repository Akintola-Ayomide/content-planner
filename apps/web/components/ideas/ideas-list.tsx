"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

interface Idea {
  id: string
  title: string
  description: string
  content_type: string
  category: string
  tone: string
  created_at: string
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
        const supabase = createClient()
        const { data, error } = await supabase.from("ideas").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching ideas:", error)
          return
        }

        setIdeas(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [refreshKey])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (ideas.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            No ideas generated yet. Use the generator above to create your first idea!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <Card key={idea.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{idea.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{idea.content_type}</span>
                  <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                    {idea.category}
                  </span>
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">{idea.tone}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-foreground">{idea.description}</p>
            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-xs text-muted-foreground">{format(new Date(idea.created_at), "MMM d, yyyy h:mm a")}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button size="sm">Schedule</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
