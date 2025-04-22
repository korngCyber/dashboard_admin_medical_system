import type { Product } from "@/types"
import { api } from "@/services/api" // Make sure this path is correct

/**
 * Product service for handling product-related operations
 */
export const productService = {
  /**
   * Get all products
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      return await api.get<Product[]>("/products")
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
      return await api.get<Product>(`/products/${id}`)
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
      return await api.post<Product>("/products", product)
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
      return await api.put<Product>(`/products/${id}`, product)
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
      await api.delete(`/products/${id}`)
      return true
    } catch (error) {
      console.error(`Failed to delete product with ID ${id}:`, error)
      return false
    }
  },
}
