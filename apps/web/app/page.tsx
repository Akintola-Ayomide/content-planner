"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }

    checkAuth()
  }, [router])

  return null
}
