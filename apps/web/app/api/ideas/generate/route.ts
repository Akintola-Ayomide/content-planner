import { generateObject } from "ai"
import { z } from "zod"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const ideaSchema = z.object({
  title: z.string().describe("Catchy and memorable content title"),
  description: z.string().describe("Detailed description of the idea"),
  key_points: z.array(z.string()).describe("Main points or talking points"),
  call_to_action: z.string().optional().describe("Suggested call-to-action for the content"),
})

export async function POST(req: Request) {
  try {
    // Get user from session
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, contentType, category, tone } = await req.json()

    const { object: idea } = await generateObject({
      model: "openai/gpt-4-turbo",
      schema: ideaSchema,
      prompt: `Generate a creative ${contentType} content idea based on this prompt: "${prompt}". 
        Category: ${category || "general"}. 
        Tone: ${tone || "informative"}.
        Make it engaging, original, and actionable.`,
      temperature: 0.8,
    })

    const { data, error } = await supabase
      .from("ideas")
      .insert({
        user_id: user.id,
        title: idea.title,
        description: idea.description,
        content_type: contentType,
        category,
        tone,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return Response.json({ error: "Failed to save idea" }, { status: 500 })
    }

    return Response.json({
      id: data.id,
      ...idea,
      ...data,
    })
  } catch (error) {
    console.error("Error generating idea:", error)
    return Response.json({ error: "Failed to generate idea" }, { status: 500 })
  }
}
