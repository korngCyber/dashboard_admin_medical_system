import axios from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1";

// Request options type
type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
};

// Error response type
type ErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
};

/**
 * Handles API requests with error handling and authentication
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", headers = {}, body, requiresAuth = true } = options;

  try {
    const response = await axios.request<T>({
      url: endpoint,
      method,
      headers,
      data: method !== "GET" ? body : undefined,
    });

    return response.data;
  } catch (error: any) {
    console.error("API request failed:", error);

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      window.location.href = "/login";
      throw new Error("Your session has expired. Please log in again.");
    }

    // Show toast error
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    throw error;
  }
}

/**
 * Helper methods for common HTTP methods
 */
export const api = {
  get: <T>(
      endpoint: string,
      options?: Omit<RequestOptions, "method" | "body">
  ) => apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
      endpoint: string,
      body: any,
      options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
      endpoint: string,
      body: any,
      options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
      endpoint: string,
      body: any,
      options?: Omit<RequestOptions, "method">
  ) => apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method">) =>
      apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};