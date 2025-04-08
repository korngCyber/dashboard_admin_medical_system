import type { Customer } from "@/types"
import { mockCustomers } from "@/lib/mock-data"

/**
 * Customer service for handling customer-related operations
 */
export const customerService = {
  /**
   * Get all customers
   */
  getCustomers: async (): Promise<Customer[]> => {
    try {
      // For demo purposes, we're using mock data
      return mockCustomers

      // In a real app with an API:
      // return await api.get<Customer[]>('/customers')
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      return []
    }
  },

  /**
   * Get customer by ID
   */
  getCustomerById: async (id: string): Promise<Customer | null> => {
    try {
      // For demo purposes, we're using mock data
      const customer = mockCustomers.find((c) => c.id === id)
      return customer || null

      // In a real app with an API:
      // return await api.get<Customer>(`/customers/${id}`)
    } catch (error) {
      console.error(`Failed to fetch customer with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Create a new customer
   */
  createCustomer: async (customer: Omit<Customer, "id" | "totalOrders" | "totalSpent">): Promise<Customer | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const newCustomer: Customer = {
        ...customer,
        id: Math.random().toString(36).substring(2, 9),
        totalOrders: 0,
        totalSpent: 0,
      }

      return newCustomer

      // In a real app with an API:
      // return await api.post<Customer>('/customers', customer)
    } catch (error) {
      console.error("Failed to create customer:", error)
      return null
    }
  },

  /**
   * Update an existing customer
   */
  updateCustomer: async (id: string, customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const existingCustomer = mockCustomers.find((c) => c.id === id)
      if (!existingCustomer) return null

      const updatedCustomer: Customer = {
        ...existingCustomer,
        ...customer,
      }

      return updatedCustomer

      // In a real app with an API:
      // return await api.put<Customer>(`/customers/${id}`, customer)
    } catch (error) {
      console.error(`Failed to update customer with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Delete a customer
   */
  deleteCustomer: async (id: string): Promise<boolean> => {
    try {
      // For demo purposes, we're returning a success response
      return true

      // In a real app with an API:
      // await api.delete(`/customers/${id}`)
      // return true
    } catch (error) {
      console.error(`Failed to delete customer with ID ${id}:`, error)
      return false
    }
  },

  /**
   * Get top customers by total spent
   */
  getTopCustomers: async (limit = 5): Promise<Customer[]> => {
    try {
      // For demo purposes, we're using mock data
      return [...mockCustomers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit)

      // In a real app with an API:
      // return await api.get<Customer[]>(`/customers/top?limit=${limit}`)
    } catch (error) {
      console.error("Failed to fetch top customers:", error)
      return []
    }
  },
}

