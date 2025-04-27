"use client"

import { useEffect, useState } from "react"
import { ClipboardList, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authService } from "@/services/auth-service"

export default function DashboardPage() {
  const [user, setUser] = useState({ name: "" })

  useEffect(() => {
    const userData = authService.getCurrentUser()
    if (userData) {
      setUser({ name: userData.name })
    }
  }, [])

  return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Card className="w-full max-w-4xl text-center shadow-2xl border-t-4 border-t-primary">
          <CardHeader className="space-y-8 pb-10">
            <div className="relative">
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-primary/20 to-primary/30 flex items-center justify-center shadow-xl">
                <ClipboardList className="h-12 w-12 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <CardTitle className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-primary to-indigo-600 bg-clip-text text-transparent">
                Welcome to Medical Admin
              </CardTitle>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-600 via-primary to-indigo-600 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="pb-12 px-8">
            <div className="space-y-6">
              <p className="text-2xl font-semibold text-muted-foreground">
                Hello, <span className="text-primary">{user.name || "Administrator"}</span>! 👋
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Welcome to your medical administration dashboard. Manage your healthcare system with ease and efficiency.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}