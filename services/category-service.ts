import { api } from "@/services/api";
import type { Category } from "@/types";

export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>("/category");  // Adjusted endpoint
      return response;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      const response = await api.get<Category>(`/category/${id}`);  // Adjusted endpoint
      return response;
    } catch (error) {
      console.error(`Failed to fetch category with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Create a new category
   */
  createCategory: async (
    category: Omit<Category, "id" | "productCount">
  ): Promise<Category | null> => {
    try {
      const response = await api.post<Category>("/category", category);  // Adjusted endpoint
      return response;
    } catch (error) {
      console.error("Failed to create category:", error);
      return null;
    }
  },

  /**
   * Update an existing category
   */
  updateCategory: async (
    id: string,
    category: Partial<Omit<Category, "productCount">>
  ): Promise<Category | null> => {
    try {
      const response = await api.put<Category>(`/category/${id}`, category);  // Adjusted endpoint
      return response;
    } catch (error) {
      console.error(`Failed to update category with ID ${id}:`, error);
      return null;
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/category/${id}`);  // Adjusted endpoint
      return true;
    } catch (error) {
      console.error(`Failed to delete category with ID ${id}:`, error);
      return false;
    }
  },
};
