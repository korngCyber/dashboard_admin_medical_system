/**
 * Base API service for handling HTTP requests
 */

import { toast } from "@/hooks/use-toast";

// API configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1"; // Ensure it's the correct backend URL

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

  // Construct request headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  // Attach Authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  // Construct request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add request body for non-GET methods
  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body);
  }

  // Dev logging
  if (process.env.NODE_ENV === "development") {
    console.log(`[API] ${method} ${API_BASE_URL}${endpoint}`, {
      headers: requestHeaders,
      body,
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAuthenticated");
      window.location.href = "/login";
      throw new Error("Your session has expired. Please log in again.");
    }

    const data = await response.json();

    // Handle other errors
    if (!response.ok) {
      const error: ErrorResponse = {
        message: data.message || "An unexpected error occurred",
        errors: data.errors,
        status: response.status,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error("API request failed:", error);

    // Show toast error
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }

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
