// services/auth-service.ts
import api from '@/lib/axios'
import Cookies from 'js-cookie'

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  address?: string
  avatar?: string
}

interface LoginResponse {
  message: string
  staff: User
}

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      const { data } = await api.post<LoginResponse>('/auth/staff/login', credentials)

      // Changed cookie key from 'user' to 'userStaff'
      Cookies.set('userStaff', JSON.stringify(data.staff), { expires: 7 })

      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  },

  logout(): void {
    // Changed cookie key
    Cookies.remove('userStaff')
  },

  getCurrentUser(): User | null {
    // Changed cookie key
    const userJson = Cookies.get('userStaff')
    if (!userJson) return null
    return JSON.parse(userJson)
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser()
  }
}