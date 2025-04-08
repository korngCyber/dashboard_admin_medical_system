// Types
type LoginCredentials = {
  email: string
  password: string
}

type LoginResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

type UserProfile = {
  id: string
  name: string
  email: string
  role: string
}

/**
 * Authentication service for handling user authentication
 */
export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // For demo purposes, we're using mock authentication
      // In a real app, this would call the API
      if (credentials.email === "admin@medical.com" && credentials.password === "password") {
        // Mock successful login
        const mockResponse: LoginResponse = {
          token: "mock-jwt-token",
          user: {
            id: "user-1",
            name: "Admin User",
            email: credentials.email,
            role: "admin",
          },
        }

        // Store auth data
        localStorage.setItem("authToken", mockResponse.token)
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("user", JSON.stringify(mockResponse.user))

        return true
      }

      return false

      // In a real app with an API:
      // const response = await api.post<LoginResponse>('/auth/login', credentials, { requiresAuth: false })
      // localStorage.setItem('authToken', response.token)
      // localStorage.setItem('isAuthenticated', 'true')
      // localStorage.setItem('user', JSON.stringify(response.user))
      // return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  },

  /**
   * Get current user profile
   */
  getCurrentUser: (): UserProfile | null => {
    const userJson = localStorage.getItem("user")
    if (!userJson) return null

    try {
      return JSON.parse(userJson) as UserProfile
    } catch (error) {
      console.error("Failed to parse user data:", error)
      return null
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return localStorage.getItem("isAuthenticated") === "true"
  },
}

