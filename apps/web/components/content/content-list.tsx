"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2 } from "lucide-react"

interface ContentItem {
  id: string
  title: string
  excerpt: string
  content_type: string
  status: string
  created_at: string
  updated_at: string
}

interface ContentListProps {
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  statusFilter?: string
}

export function ContentList({ onEdit, onDelete, statusFilter }: ContentListProps) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const query = statusFilter ? `?status=${statusFilter}` : ""
        const response = await fetch(`/api/content${query}`)
        if (response.ok) {
          const data = await response.json()
          setItems(data)
        }
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "archived":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-purple-100 text-purple-800"
      case "social":
        return "bg-pink-100 text-pink-800"
      case "email":
        return "bg-orange-100 text-orange-800"
      case "video":
        return "bg-red-100 text-red-800"
      case "podcast":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return <div className="text-muted-foreground">Loading content...</div>
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center py-8">
            No content found. Create your first piece of content to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">{item.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{item.excerpt}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <Badge className={getTypeColor(item.content_type)}>{item.content_type}</Badge>
                  <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => onEdit(item.id)} title="Edit">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(item.id)}
                  title="Delete"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
