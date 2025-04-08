import type { Order } from "@/types"
import { mockOrders } from "@/lib/mock-data"

/**
 * Order service for handling order-related operations
 */
export const orderService = {
  /**
   * Get all orders
   */
  getOrders: async (): Promise<Order[]> => {
    try {
      // For demo purposes, we're using mock data
      return mockOrders

      // In a real app with an API:
      // return await api.get<Order[]>('/orders')
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      return []
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      // For demo purposes, we're using mock data
      const order = mockOrders.find((o) => o.id === id)
      return order || null

      // In a real app with an API:
      // return await api.get<Order>(`/orders/${id}`)
    } catch (error) {
      console.error(`Failed to fetch order with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const order = mockOrders.find((o) => o.id === id)
      if (!order) return null

      const updatedOrder: Order = {
        ...order,
        status,
      }

      return updatedOrder

      // In a real app with an API:
      // return await api.patch<Order>(`/orders/${id}/status`, { status })
    } catch (error) {
      console.error(`Failed to update status for order with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Get orders by customer ID
   */
  getOrdersByCustomer: async (customerId: string): Promise<Order[]> => {
    try {
      // For demo purposes, we're using mock data
      return mockOrders.filter((o) => o.customer.id === customerId)

      // In a real app with an API:
      // return await api.get<Order[]>(`/customers/${customerId}/orders`)
    } catch (error) {
      console.error(`Failed to fetch orders for customer with ID ${customerId}:`, error)
      return []
    }
  },

  /**
   * Get order statistics
   */
  getOrderStats: async (): Promise<{
    total: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
  }> => {
    try {
      // For demo purposes, we're calculating from mock data
      const stats = {
        total: mockOrders.length,
        pending: mockOrders.filter((o) => o.status === "pending").length,
        processing: mockOrders.filter((o) => o.status === "processing").length,
        shipped: mockOrders.filter((o) => o.status === "shipped").length,
        delivered: mockOrders.filter((o) => o.status === "delivered").length,
        cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
      }

      return stats

      // In a real app with an API:
      // return await api.get<OrderStats>('/orders/stats')
    } catch (error) {
      console.error("Failed to fetch order statistics:", error)
      return {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      }
    }
  },
}

