"use client"

import { useEffect, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Calendar,
  BarChart2,
  PieChart,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockOrders, mockProducts, mockCustomers } from "@/lib/mock-data"
import type { DashboardStats } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    // Calculate stats from mock data
    const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0)

    setStats({
      totalSales,
      totalOrders: mockOrders.length,
      totalProducts: mockProducts.length,
      totalCustomers: mockCustomers.length,
    })
  }, [])

  // Calculate order status counts
  const pendingOrders = mockOrders.filter((order) => order.status === "pending").length
  const processingOrders = mockOrders.filter((order) => order.status === "processing").length
  const shippedOrders = mockOrders.filter((order) => order.status === "shipped").length
  const deliveredOrders = mockOrders.filter((order) => order.status === "delivered").length
  const cancelledOrders = mockOrders.filter((order) => order.status === "cancelled").length

  // Calculate total order count
  const totalOrderCount = mockOrders.length

  // Calculate percentages for the chart
  const pendingPercentage = (pendingOrders / totalOrderCount) * 100
  const processingPercentage = (processingOrders / totalOrderCount) * 100
  const shippedPercentage = (shippedOrders / totalOrderCount) * 100
  const deliveredPercentage = (deliveredOrders / totalOrderCount) * 100
  const cancelledPercentage = (cancelledOrders / totalOrderCount) * 100

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Welcome back to your medical system overview</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/10 -mt-6 -mr-6" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-emerald-500 flex items-center mr-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    12.5%
                  </span>
                  vs. previous {timeRange}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/10 -mt-6 -mr-6" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-emerald-500 flex items-center mr-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    8.2%
                  </span>
                  vs. previous {timeRange}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-500/10 -mt-6 -mr-6" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-rose-500 flex items-center mr-1">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    2.5%
                  </span>
                  vs. previous {timeRange}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-violet-500/10 -mt-6 -mr-6" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <span className="text-emerald-500 flex items-center mr-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    5.7%
                  </span>
                  vs. previous {timeRange}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the current year</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <BarChart2 className="h-3.5 w-3.5 mr-1" />
                Bar
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Line
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <div className="flex h-full flex-col justify-between">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">January</div>
                    <div className="text-sm">$12,500</div>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">February</div>
                    <div className="text-sm">$15,300</div>
                  </div>
                  <Progress value={55} className="h-2" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">March</div>
                    <div className="text-sm">$21,200</div>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">April</div>
                    <div className="text-sm">$18,700</div>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">May</div>
                    <div className="text-sm">$25,900</div>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">June</div>
                    <div className="text-sm">$22,500</div>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold">{totalOrderCount}</div>
                    <div className="text-xs text-muted-foreground">Total Orders</div>
                  </div>
                </div>
                <PieChart className="h-full w-full text-muted-foreground/30" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                <div className="flex-1 text-sm">Pending</div>
                <div className="text-sm font-medium">{pendingOrders}</div>
                <div className="ml-2 text-xs text-muted-foreground">{pendingPercentage.toFixed(1)}%</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
                <div className="flex-1 text-sm">Processing</div>
                <div className="text-sm font-medium">{processingOrders}</div>
                <div className="ml-2 text-xs text-muted-foreground">{processingPercentage.toFixed(1)}%</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                <div className="flex-1 text-sm">Shipped</div>
                <div className="text-sm font-medium">{shippedOrders}</div>
                <div className="ml-2 text-xs text-muted-foreground">{shippedPercentage.toFixed(1)}%</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                <div className="flex-1 text-sm">Delivered</div>
                <div className="text-sm font-medium">{deliveredOrders}</div>
                <div className="ml-2 text-xs text-muted-foreground">{deliveredPercentage.toFixed(1)}%</div>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-rose-500 mr-2"></div>
                <div className="flex-1 text-sm">Cancelled</div>
                <div className="text-sm font-medium">{cancelledOrders}</div>
                <div className="ml-2 text-xs text-muted-foreground">{cancelledPercentage.toFixed(1)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View All
              </Button>
            </div>
            <CardDescription>Latest orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.customer.name}`}
                      alt={order.customer.name}
                    />
                    <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">{order.customer.name}</p>
                      <p className="text-sm font-medium text-primary">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Order #{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Status</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View All
              </Button>
            </div>
            <CardDescription>Stock levels of your top products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
                      </div>
                      <div className="mt-1">
                        <Progress
                          value={product.stock > 100 ? 100 : product.stock}
                          className="h-1.5"
                          indicatorClassName={
                            product.status === "in-stock"
                              ? "bg-emerald-500"
                              : product.status === "low-stock"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

