import axios from "axios";
import type { Customer } from "@/types";

const API_URL = "http://localhost:3002/api/v1/customer/";
const allCus = "http://localhost:3002/api/v1/customer/customer/all";

export const customerService = {
  async getCustomers() {
    try {
      const res = await axios.get(allCus);
      
      // Check if the response contains an array of customers
      // If it's not an array, ensure we return an array for the page component
      if (res.data && Array.isArray(res.data)) {
        return res.data;
      } else if (res.data && Array.isArray(res.data.customers)) {
        return res.data.customers;
      } else if (res.data && typeof res.data === 'object') {
        // If it's a single customer object, wrap it in an array
        if (res.data.cusId) {
          return [res.data];
        }
        
        // If it's another object structure, check common response patterns
        const possibleArrays = ['customers', 'data', 'items', 'results'];
        for (const key of possibleArrays) {
          if (res.data[key] && Array.isArray(res.data[key])) {
            return res.data[key];
          }
        }
      }
      
      // If we can't identify the structure, log it and return empty array to prevent errors
      console.error("Unexpected API response format:", res.data);
      return [];
    } catch (error: any) {
      console.error(
        "Error fetching customers:", 
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getCustomerById(id: string) {
    try {
      const res = await axios.get(`${API_URL}${id}`);
      return res.data;
    } catch (error: any) {
      console.error(
        "Error fetching customer details:", 
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async createCustomer(data: FormData) {
    try {
      const res = await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const newCustomer = res.data.customer || res.data;
      if (!newCustomer) {
        throw new Error("Invalid response from the server");
      }

      return {
        id: newCustomer.cusId?.toString() || "",
        name: newCustomer.cusName || "",
        email: newCustomer.cusEmail || "",
        phone: newCustomer.cusPhone || "",
        address: newCustomer.cusAddress || "",
        status: newCustomer.cusStatus || false,
        role: newCustomer.cusRole || "customer",
        image: newCustomer.cusImage || "",
        bio: newCustomer.cusBio || "",
        createdAt: newCustomer.created_at ? new Date(newCustomer.created_at) : new Date(),
        updatedAt: newCustomer.updated_at ? new Date(newCustomer.updated_at) : new Date(),
        totalOrders: 0,
        totalSpent: 0
      };
    } catch (error) {
      console.error(
        "Error in createCustomer:",
        (error as any).response?.data || (error as any).message
      );
      throw error;
    }
  },

  async updateCustomer(id: string, data: FormData) {
    try {
      const res = await axios.put(`${API_URL}${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const updatedCustomer = res.data.customer || res.data;
  
      return {
        id: updatedCustomer.cusId?.toString() || id,
        name: updatedCustomer.cusName || data.get("cusName"),
        email: updatedCustomer.cusEmail || data.get("cusEmail"),
        phone: updatedCustomer.cusPhone || data.get("cusPhone"),
        address: updatedCustomer.cusAddress || data.get("cusAddress"),
        status: updatedCustomer.cusStatus ?? data.get("cusStatus") === "true",
        role: updatedCustomer.cusRole || data.get("cusRole") || "customer",
        image: updatedCustomer.cusImage || data.get("cusImage") || "",
        bio: updatedCustomer.cusBio || data.get("cusBio") || "",
        createdAt: updatedCustomer.created_at ? new Date(updatedCustomer.created_at) : new Date(),
        updatedAt: updatedCustomer.updated_at ? new Date(updatedCustomer.updated_at) : new Date(),
        totalOrders: 0,
        totalSpent: 0
      };
    } catch (error: any) {
      if (error.response) {
        console.error("Error in updateCustomer:", error.response.data || error.message);
        throw new Error(
          error.response.data?.message || "An error occurred while updating the customer."
        );
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        throw new Error("No response received from the server. Please try again later.");
      } else {
        console.error("Unexpected error in updateCustomer:", error.message);
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  },

  async deleteCustomer(id: string) {
    try {
      await axios.delete(`${API_URL}${id}`);
      return true;
    } catch (error: any) {
      console.error(
        "Error deleting customer:", 
        error.response?.data || error.message
      );
      throw error;
    }
  },
};