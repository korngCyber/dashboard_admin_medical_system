import axios from "axios";
import type { Product } from "@/types";

const API_URL = "http://localhost:3002/api/v1/product/";

export const productService = {
  async getProduct() {
    const res = await axios.get(API_URL);
    return res.data;
  },

  async createProduct(data: FormData) {
    try {
      const res = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newPro = res.data.product; // Ensure the response structure matches
      if (!newPro) {
        throw new Error("Invalid response from the server");
      }

      return {
        id: newPro.proId?.toString() || "",
        name: newPro.proName || "",
        description: newPro.proDescription || "",
        price: parseFloat(newPro.proPrice) || 0,
        stock: newPro.proStock || 0,
        category: newPro.catId?.toString() || "", // Ensure catId is safely accessed
        status: newPro.proStatus || "unknown",
        image: newPro.images?.[0]?.imageUrl || "", // Handle image field
      };
    } catch (error) {
      console.error(
        "Error in createProduct:",
        (error as any).response?.data || (error as any).message
      );
      throw error;
    }
  },

  async updateProduct(id: string, data: FormData) {
    try {
      const res = await axios.put(`${API_URL}${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const updatedPro = res.data.product || res.data;
  
      return {
        id: updatedPro.proId?.toString() || id,
        name: updatedPro.proName || data.get("proName"),
        description: updatedPro.proDescription || data.get("proDescription"),
        price: parseFloat(updatedPro.proPrice) || parseFloat(data.get("proPrice") as string),
        stock: updatedPro.proStock || parseInt(data.get("proStock") as string, 10),
        category: updatedPro.catId?.toString() || data.get("catId"),
        status: updatedPro.proStatus || data.get("proStatus"),
        image: updatedPro.images?.[0]?.imageUrl || data.get("existingImagePath") || "",
      };
    } catch (error: any) {
      if (error.response) {
        console.error("Error in updateProduct:", error.response.data || error.message);
        throw new Error(
          error.response.data?.message || "An error occurred while updating the product."
        );
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        throw new Error("No response received from the server. Please try again later.");
      } else {
        console.error("Unexpected error in updateProduct:", error.message);
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  async deleteProduct(id: string) {
    await axios.delete(`${API_URL}${id}`);
    return true;
  },
};