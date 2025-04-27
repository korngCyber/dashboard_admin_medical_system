"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import type { Order } from "@/types"
import { orderService } from "@/services/order-service"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true)
        const data = await orderService.getOrders()
        const transformedOrders: Order[] = data.map((order: any) => ({
          id: order.orderId.toString(),
          orderNumber: order.orderId.toString().padStart(5, '0'),
          date: new Date(order.orderDate).toLocaleDateString(),
          customer: {
            id: order.cusId.toString(),
            name: `Customer ${order.cusId}`,
            email: "customer@example.com"
          },
          status: order.orderStatus,
          total: parseFloat(order.orderTotalAmount),
          items: []
        }))
        setOrders(transformedOrders)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Order
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">#{row.getValue("orderNumber")}</div>,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => <div>{row.original.customer.name}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} variant="order" />
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original
        return (
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCurrentOrder(order)
                  setIsViewDialogOpen(true)
                }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
        )
      },
    },
  ]

  if (error) {
    return (
        <div className="flex flex-col gap-4">
          <PageHeader title="Orders" description="Manage your medicine orders" />
          <div className="text-center text-red-500 p-4">Error: {error}</div>
        </div>
    )
  }

  if (isLoading) {
    return (
        <div className="flex flex-col gap-4">
          <PageHeader title="Orders" description="Manage your medicine orders" />
          <div className="text-center p-4">Loading orders...</div>
        </div>
    )
  }

  return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Orders" description="Manage your medicine orders" />

        <DataTable columns={columns} data={orders} searchKey="orderNumber" searchPlaceholder="Filter orders..." />

        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Detailed information about the selected order</DialogDescription>
            </DialogHeader>
            {currentOrder && (
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Order Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Order Number</p>
                          <p className="text-sm">#{currentOrder.orderNumber}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm">{currentOrder.date}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Status</p>
                          <StatusBadge status={currentOrder.status} variant="order" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Total</p>
                          <p className="text-sm">${currentOrder.total}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Name</p>
                          <p className="text-sm">{currentOrder.customer.name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm">{currentOrder.customer.email}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  )
}