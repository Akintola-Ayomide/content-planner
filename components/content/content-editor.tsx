"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Save, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContentEditorProps {
  initialData?: {
    id?: string
    title: string
    excerpt: string
    content: string
    content_type: string
    tags: string[]
  }
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

export function ContentEditor({ initialData, onSave, onCancel }: ContentEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [contentType, setContentType] = useState(initialData?.content_type || "blog")
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onSave({
        title,
        excerpt,
        content,
        content_type: contentType,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save content")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {initialData?.id ? "Edit Content" : "Create New Content"}
          </h2>
          <p className="text-muted-foreground mt-1">Write and format your content here</p>
        </div>
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
          <CardDescription>Basic information about your content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Excerpt</label>
            <Input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of your content"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="blog">Blog Post</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="video">Video Script</option>
              <option value="podcast">Podcast Transcript</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Tags</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Write your content in markdown format</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your content here. Markdown is supported."
            className="w-full h-96 px-3 py-2 border border-input rounded-md bg-background text-foreground font-mono text-sm"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Content"}
        </Button>
      </div>
    </div>
  )
}
