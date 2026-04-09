"use client"

import { useState } from "react"
import { IdeaGenerator } from "@/components/ideas/idea-generator"
import { IdeasList } from "@/components/ideas/ideas-list"

export default function IdeasPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleIdeaGenerated = () => {
    // Trigger refresh of ideas list
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Ideas</h1>
        <p className="text-muted-foreground mt-2">Generate and manage your AI-powered content ideas</p>
      </div>

      <IdeaGenerator onIdeaGenerated={handleIdeaGenerated} />

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Your Ideas</h2>
        <IdeasList refreshKey={refreshKey} />
      </div>
    </div>
  )
}
