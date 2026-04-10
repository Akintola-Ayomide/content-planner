"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { api } from "@/lib/api-client"

interface Idea {
  id: string
  title: string
  description: string
  key_points: string[]
  call_to_action?: string
  content_type: string
  category: string
  tone: string
}

interface IdeaGeneratorProps {
  onIdeaGenerated: (idea: Idea) => void
}

export function IdeaGenerator({ onIdeaGenerated }: IdeaGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [contentType, setContentType] = useState("blog-post")
  const [category, setCategory] = useState("general")
  const [tone, setTone] = useState("informative")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const idea = await api.post("/ideas/generate", {
        prompt,
        contentType,
        category,
        tone,
      })
      
      onIdeaGenerated(idea)
      setPrompt("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-xl shadow-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Generate New Idea
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-foreground/80">What's your content idea about?</label>
          <Textarea
            placeholder="Describe the topic or theme you want to create content about..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="mt-2 bg-background/50 border-primary/10 focus:border-primary/30 transition-all resize-none rounded-xl"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-semibold text-foreground/80">Content Type</label>
            <Select value={contentType} onValueChange={setContentType} disabled={loading}>
              <SelectTrigger className="mt-2 bg-background/50 border-primary/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog-post">Blog Post</SelectItem>
                <SelectItem value="social-media">Social Media Post</SelectItem>
                <SelectItem value="video-script">Video Script</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="podcast-episode">Podcast Episode</SelectItem>
                <SelectItem value="infographic">Infographic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground/80">Category</label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger className="mt-2 bg-background/50 border-primary/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground/80">Tone</label>
            <Select value={tone} onValueChange={setTone} disabled={loading}>
              <SelectTrigger className="mt-2 bg-background/50 border-primary/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="humorous">Humorous</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse"></span>
            {error}
          </div>
        )}

        <Button 
          onClick={handleGenerate} 
          disabled={loading || !prompt.trim()} 
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Generating...
            </div>
          ) : (
            "Generate AI Idea"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
