import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Calendar</h1>
        <p className="text-muted-foreground mt-2">Plan and schedule your content across all channels</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Calendar view coming soon. Schedule your content and visualize your posting schedule.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
