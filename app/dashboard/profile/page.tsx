"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authService } from "@/services/auth-service"
import { Loader2, User, Mail, Phone, MapPin, Shield, Key } from "lucide-react"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    phone: "+1 (555) 123-4567",
    address: "123 Medical St, Health City, HC 12345",
    bio: "Medical administrator with 5+ years of experience in healthcare management.",
  })
  const { toast } = useToast()

  useEffect(() => {
    // Get user data from auth service
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      })
    }, 1000)
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" description="Manage your account settings and preferences" />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>View and manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
              {user.role === "admin" ? "Administrator" : "User"}
            </div>
            <div className="mt-6 space-y-4 w-full">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>{user.role === "admin" ? "Administrator" : "User"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-6">
              <Card>
                <form onSubmit={handleProfileUpdate}>
                  <CardHeader>
                    <CardTitle>General Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          onChange={(e) => setUser({ ...user, email: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={user.phone}
                          onChange={(e) => setUser({ ...user, phone: e.target.value })}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="address"
                          value={user.address}
                          onChange={(e) => setUser({ ...user, address: e.target.value })}
                          className="pl-10 min-h-[80px]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={user.bio}
                        onChange={(e) => setUser({ ...user, bio: e.target.value })}
                        className="min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-6">
              <Card>
                <form onSubmit={handlePasswordUpdate}>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="current-password" type="password" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="new-password" type="password" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="confirm-password" type="password" className="pl-10" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Two-factor authentication is not enabled yet</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Enable Two-Factor Authentication
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

