"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { api } from "@/lib/api-client"
import { Edit2, Trash2, Calendar, FileText, CheckCircle2, MoreVertical, Type } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Content {
  id: string
  title: string
  content: string
  contentType: string
  status: string
  createdAt: string
  updatedAt: string
}

interface ContentListProps {
  statusFilter?: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ContentList({ statusFilter, onEdit, onDelete }: ContentListProps) {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true)
      try {
        const url = statusFilter ? `/content?status=${statusFilter}` : "/content"
        const data = await api.get(url)
        setContents(data || [])
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [statusFilter])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-8 rounded-full" />
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

  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 border-2 border-dashed border-primary/10 rounded-2xl bg-card/30">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No content found</h3>
        <p className="text-muted-foreground text-center max-w-sm mt-2">
          {statusFilter 
            ? `You don't have any content with status '${statusFilter}' yet.`
            : "You haven't created any content yet. Click the button above to start your first piece!"}
        </p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-muted-foreground/10"><FileText className="w-3 h-3" />Draft</span>
      case "scheduled":
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 px-2.5 py-1 rounded-full border border-orange-500/10"><Calendar className="w-3 h-3" />Scheduled</span>
      case "published":
        return <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full border border-green-500/10"><CheckCircle2 className="w-3 h-3" />Published</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {contents.map((item) => (
        <Card key={item.id} className="group hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors cursor-pointer" onClick={() => onEdit(item.id)}>
                  {item.title}
                </CardTitle>
                {getStatusBadge(item.status)}
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Type className="w-3.5 h-3.5" />
                  {item.contentType.replace('-', ' ').toUpperCase()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(item.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl border-primary/10 shadow-xl overflow-hidden">
                <DropdownMenuItem onClick={() => onEdit(item.id)} className="gap-2 py-2 cursor-pointer focus:bg-primary/10 focus:text-primary">
                  <Edit2 className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(item.id)} className="gap-2 py-2 cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {item.content || "No content content available."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
