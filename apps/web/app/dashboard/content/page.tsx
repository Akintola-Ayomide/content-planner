"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content/content-editor"
import { ContentList } from "@/components/content/content-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Sparkles, FileText, Calendar, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api-client"

export default function ContentPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleCreateNew = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async (data: any) => {
    try {
      await api.post("/content", data)
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
      await api.delete(`/content/${id}`)
      setRefreshKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error deleting content:", error)
    }
  }

  if (isEditing) {
    return <ContentEditor onSave={handleSave} onCancel={handleCancel} />
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Your Content</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage, refine, and orchestrate all your created pieces.</p>
        </div>
        <Button 
          onClick={handleCreateNew} 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Content
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-primary/5 mb-8">
          <TabsTrigger value="all" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            All Content
          </TabsTrigger>
          <TabsTrigger value="draft" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
            <FileText className="w-4 h-4 mr-2" />
            Drafts
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
            <Calendar className="w-4 h-4 mr-2" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="published" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Published
          </TabsTrigger>
        </TabsList>

        <div className="mt-2">
          <TabsContent value="all" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentList key={`all-${refreshKey}`} onEdit={handleEdit} onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="draft" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentList key={`draft-${refreshKey}`} onEdit={handleEdit} onDelete={handleDelete} statusFilter="draft" />
          </TabsContent>
          <TabsContent value="scheduled" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentList key={`scheduled-${refreshKey}`} onEdit={handleEdit} onDelete={handleDelete} statusFilter="scheduled" />
          </TabsContent>
          <TabsContent value="published" className="focus-visible:outline-none focus-visible:ring-0">
            <ContentList key={`published-${refreshKey}`} onEdit={handleEdit} onDelete={handleDelete} statusFilter="published" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
