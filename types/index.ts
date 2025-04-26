// Common types used throughout the application

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
};

export type Category = {
  id: string;
  name: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  // Additional fields from API response
  status: boolean;
  role: string;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
};

export type DashboardStats = {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
};
