import type { Product } from "@/types"
import { mockProducts } from "@/lib/mock-data"

/**
 * Product service for handling product-related operations
 */
export const productService = {
  /**
   * Get all products
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      // For demo purposes, we're using mock data
      // In a real app, this would call the API
      return mockProducts

      // In a real app with an API:
      // return await api.get<Product[]>('/products')
    } catch (error) {
      console.error("Failed to fetch products:", error)
      return []
    }
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: string): Promise<Product | null> => {
    try {
      // For demo purposes, we're using mock data
      const product = mockProducts.find((p) => p.id === id)
      return product || null

      // In a real app with an API:
      // return await api.get<Product>(`/products/${id}`)
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Create a new product
   */
  createProduct: async (product: Omit<Product, "id">): Promise<Product | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const newProduct: Product = {
        ...product,
        id: Math.random().toString(36).substring(2, 9),
      }

      return newProduct

      // In a real app with an API:
      // return await api.post<Product>('/products', product)
    } catch (error) {
      console.error("Failed to create product:", error)
      return null
    }
  },

  /**
   * Update an existing product
   */
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const updatedProduct: Product = {
        ...mockProducts.find((p) => p.id === id)!,
        ...product,
      }

      return updatedProduct

      // In a real app with an API:
      // return await api.put<Product>(`/products/${id}`, product)
    } catch (error) {
      console.error(`Failed to update product with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Delete a product
   */
  deleteProduct: async (id: string): Promise<boolean> => {
    try {
      // For demo purposes, we're returning a success response
      return true

      // In a real app with an API:
      // await api.delete(`/products/${id}`)
      // return true
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error)
      return false
    }
  },
}

