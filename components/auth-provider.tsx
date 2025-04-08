"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService } from "@/services/auth-service"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = () => {
      const auth = authService.isAuthenticated()
      setIsAuthenticated(auth)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  useEffect(() => {
    // Redirect based on auth status
    if (!isLoading) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login")
      } else if (isAuthenticated && pathname === "/login") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    const success = await authService.login({ email, password })

    if (success) {
      setIsAuthenticated(true)
    }

    return success
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{!isLoading && children}</AuthContext.Provider>
  )
}

