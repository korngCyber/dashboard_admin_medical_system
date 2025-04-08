import type { Category } from "@/types"
import { mockCategories } from "@/lib/mock-data"

/**
 * Category service for handling category-related operations
 */
export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      // For demo purposes, we're using mock data
      return mockCategories

      // In a real app with an API:
      // return await api.get<Category[]>('/categories')
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      return []
    }
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      // For demo purposes, we're using mock data
      const category = mockCategories.find((c) => c.id === id)
      return category || null

      // In a real app with an API:
      // return await api.get<Category>(`/categories/${id}`)
    } catch (error) {
      console.error(`Failed to fetch category with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (category: Omit<Category, "id" | "productCount">): Promise<Category | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const newCategory: Category = {
        ...category,
        id: Math.random().toString(36).substring(2, 9),
        productCount: 0,
      }

      return newCategory

      // In a real app with an API:
      // return await api.post<Category>('/categories', category)
    } catch (error) {
      console.error("Failed to create category:", error)
      return null
    }
  },

  /**
   * Update an existing category
   */
  updateCategory: async (id: string, category: Partial<Omit<Category, "productCount">>): Promise<Category | null> => {
    try {
      // For demo purposes, we're generating a mock response
      const existingCategory = mockCategories.find((c) => c.id === id)
      if (!existingCategory) return null

      const updatedCategory: Category = {
        ...existingCategory,
        ...category,
      }

      return updatedCategory

      // In a real app with an API:
      // return await api.put<Category>(`/categories/${id}`, category)
    } catch (error) {
      console.error(`Failed to update category with ID ${id}:`, error)
      return null
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      // For demo purposes, we're returning a success response
      return true

      // In a real app with an API:
      // await api.delete(`/categories/${id}`)
      // return true
    } catch (error) {
      console.error(`Failed to delete category with ID ${id}:`, error)
      return false
    }
  },
}

