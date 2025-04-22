// lib/axios.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Ensure credentials are sent with requests
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed (e.g., token from localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally (e.g., token expiration)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error, maybe logout user or redirect to login
      console.log('Unauthorized, please log in again');
    }
    return Promise.reject(error);
  }
);

export default api;
