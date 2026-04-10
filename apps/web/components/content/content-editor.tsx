"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Save, X, Sparkles, Type, Tag, FileText, Layout } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ContentEditorProps {
  initialData?: {
    id?: string
    title: string
    excerpt: string
    content: string
    contentType: string
    tags: string[]
  }
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

export function ContentEditor({ initialData, onSave, onCancel }: ContentEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [contentType, setContentType] = useState(initialData?.contentType || "blog-post")
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
            <Layout className="w-8 h-8 text-primary" />
            {initialData?.id ? "Edit Content" : "Create New Masterpiece"}
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">Bring your ideas to life with our rich editor.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onCancel} className="rounded-xl border-primary/10 hover:bg-primary/5 transition-all">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} size="lg" className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Publish Content"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="rounded-2xl bg-destructive/5 border-destructive/20 text-destructive animate-shake">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-semibold">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none bg-card/40 backdrop-blur-md shadow-2xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="w-5 h-5 text-primary" />
                Main Content
              </CardTitle>
              <CardDescription>Draft your content using markdown for rich formatting.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing here... # Hint: Use markdown!"
                className="w-full h-[600px] p-8 bg-transparent border-none rounded-none focus-visible:ring-0 text-lg leading-relaxed font-mono resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-primary/10 bg-card/50 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
              <CardDescription>Essential details for your content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title"
                  className="bg-background/50 border-primary/10 rounded-xl focus:border-primary/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Content Type
                </label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-background/50 border-primary/10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blog-post">Blog Post</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="newsletter">Email Newsletter</SelectItem>
                    <SelectItem value="video-script">Video Script</SelectItem>
                    <SelectItem value="podcast-episode">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Tags
                </label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="marketing, ai, tech..."
                  className="bg-background/50 border-primary/10 rounded-xl focus:border-primary/30 transition-all"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 bg-card/50 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
              <CardDescription>Short description for previews.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Write a brief summary..."
                className="bg-background/50 border-primary/10 rounded-xl focus:border-primary/30 transition-all resize-none h-32"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
