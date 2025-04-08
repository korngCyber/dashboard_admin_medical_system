"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  Box,
  ClipboardList,
  LogOut,
  Menu,
  Moon,
  Package,
  Settings,
  ShoppingCart,
  Sun,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/services/auth-service"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // Handle theme hydration
  useEffect(() => {
    setMounted(true)

    // Get user data
    const userData = authService.getCurrentUser()
    if (userData) {
      setUser({
        name: userData.name,
        email: userData.email,
      })
    }
  }, [])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Categories", href: "/dashboard/categories", icon: Box },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <ClipboardList className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Medical Admin
                </span>
              </Link>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4" asChild>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="grid gap-2 p-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                    {item.name === "Orders" && (
                      <Badge variant="info" className="ml-auto">
                        New
                      </Badge>
                    )}
                  </Link>
                )
              })}
              <Button
                variant="ghost"
                className="sidebar-item sidebar-item-inactive justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <ClipboardList className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Medical Admin
          </span>
        </Link>

        <div className="hidden md:flex md:flex-1 md:items-center md:gap-4 md:px-6">
          <div className="relative hidden md:flex items-center">
            <input
              type="search"
              placeholder="Search..."
              className="rounded-full bg-muted/30 pl-4 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all focus:w-80"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || "Admin User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "admin@medical.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <ClipboardList className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Medical Admin
                </span>
              </Link>
            </div>
            <nav className="grid gap-2 p-4">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                    {item.name === "Orders" && (
                      <Badge variant="info" className="ml-auto">
                        New
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-6 md:p-8 animate-in">{children}</main>
      </div>
    </div>
  )
}

