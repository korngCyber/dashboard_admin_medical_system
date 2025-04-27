"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authService } from "@/services/auth-service"
import { Mail, Phone, MapPin, Shield } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "+1 (555) 123-4567",
    address: "123 Medical St, Health City, HC 12345",
    bio: "Medical administrator with 5+ years of experience in healthcare management.",
  })

  useEffect(() => {
    const userData = authService.getCurrentUser()
    if (userData) {
      setUser((prev) => ({
        ...prev,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      }))
    }
  }, [])

  return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Profile" description="View your profile information" />

        <div className="max-w-3xl mx-auto w-full">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
              <CardDescription className="text-base">View your personal information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center px-8">
              <div className="relative mb-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user.name} />
                  <AvatarFallback className="text-3xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold tracking-tight">{user.name}</h3>
                  <p className="text-muted-foreground mt-1">{user.email}</p>
                  <div className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    {user.role === "admin" ? "Administrator" : "User"}
                  </span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-lg mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{user.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Shield className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">
                        {user.role === "admin" ? "Administrator" : "User"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}