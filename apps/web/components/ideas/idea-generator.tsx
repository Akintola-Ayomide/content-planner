"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

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
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/ideas/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          prompt,
          contentType,
          category,
          tone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate idea")
      }

      const idea = await response.json()
      onIdeaGenerated(idea)
      setPrompt("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Idea</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt textarea */}
        <div>
          <label className="text-sm font-medium text-foreground">What's your content idea about?</label>
          <Textarea
            placeholder="Describe the topic or theme you want to create content about..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            className="mt-2"
            rows={4}
          />
        </div>

        {/* Content Type Select */}
        <div>
          <label className="text-sm font-medium text-foreground">Content Type</label>
          <Select value={contentType} onValueChange={setContentType} disabled={loading}>
            <SelectTrigger className="mt-2">
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

        {/* Category and Tone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={category} onValueChange={setCategory} disabled={loading}>
              <SelectTrigger className="mt-2">
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
            <label className="text-sm font-medium text-foreground">Tone</label>
            <Select value={tone} onValueChange={setTone} disabled={loading}>
              <SelectTrigger className="mt-2">
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

        {/* Error message */}
        {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        {/* Generate button */}
        <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="w-full" size="lg">
          {loading ? "Generating..." : "Generate Idea"}
        </Button>
      </CardContent>
    </Card>
  )
}
