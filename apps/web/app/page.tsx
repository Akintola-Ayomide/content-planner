"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"

export default function Page() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">ContentPilot</p>
      </div>
    </div>
  )
}
