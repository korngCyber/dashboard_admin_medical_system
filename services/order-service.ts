import axios from "axios";
import type { Order } from "@/types";

const API_URL = "http://localhost:3002/api/v1/order/";

export const orderService = {
  async getOrders() {
    try {
      const res = await axios.get(API_URL);

      if (res.data && Array.isArray(res.data)) {
        return res.data;
      } else if (res.data && Array.isArray(res.data.orders)) {
        return res.data.orders;
      } else if (res.data && typeof res.data === "object") {
        const possibleArrays = ["orders", "data", "items", "results"];
        for (const key of possibleArrays) {
          if (res.data[key] && Array.isArray(res.data[key])) {
            return res.data[key];
          }
        }
      }

      console.error("Unexpected API response format:", res.data);
      return [];
    } catch (error: any) {
      console.error("Error fetching orders:", error.response?.data || error.message);
      throw error;
    }
  },

  async getOrderById(id: string) {
    try {
      const res = await axios.get(`${API_URL}${id}`);
      return res.data;
    } catch (error: any) {
      console.error("Error fetching order details:", error.response?.data || error.message);
      throw error;
    }
  },

  async createOrder(data: Order) {
    try {
      const res = await axios.post(API_URL, data);
      return res.data.order || res.data;
    } catch (error: any) {
      console.error("Error creating order:", error.response?.data || error.message);
      throw error;
    }
  },

  async updateOrder(id: string, data: Order) {
    try {
      const res = await axios.put(`${API_URL}${id}`, data);
      return res.data.order || res.data;
    } catch (error: any) {
      console.error("Error updating order:", error.response?.data || error.message);
      throw error;
    }
  },

  async deleteOrder(id: string) {
    try {
      await axios.delete(`${API_URL}${id}`);
      return true;
    } catch (error: any) {
      console.error("Error deleting order:", error.response?.data || error.message);
      throw error;
    }
  },
};
