"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content/content-editor"
import { ContentList } from "@/components/content/content-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"

export default function ContentPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateNew = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async (data: any) => {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to save content")

      setIsEditing(false)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      throw error
    }
  }

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log("Edit content:", id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete content")

      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error deleting content:", error)
    }
  }

  if (isEditing) {
    return <ContentEditor onSave={handleSave} onCancel={handleCancel} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Content</h1>
          <p className="text-muted-foreground mt-2">Manage all your created content</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setStatusFilter(value === "all" ? undefined : value)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ContentList key={refreshKey} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
        <TabsContent value="draft" className="mt-6">
          <ContentList key={refreshKey} onEdit={handleEdit} onDelete={handleDelete} statusFilter="draft" />
        </TabsContent>
        <TabsContent value="scheduled" className="mt-6">
          <ContentList key={refreshKey} onEdit={handleEdit} onDelete={handleDelete} statusFilter="scheduled" />
        </TabsContent>
        <TabsContent value="published" className="mt-6">
          <ContentList key={refreshKey} onEdit={handleEdit} onDelete={handleDelete} statusFilter="published" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
