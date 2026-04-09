import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-3xl font-bold text-foreground">ContentPilot</h1>
            <p className="text-sm text-muted-foreground">Plan, create, and schedule content with AI</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We&apos;ve sent you a confirmation link. Please check your email to verify your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  Click the link in your email to confirm your account and get started with ContentPilot.
                </p>
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
