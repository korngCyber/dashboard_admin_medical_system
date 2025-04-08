"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOrders } from "@/lib/mock-data"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import type { Order } from "@/types"

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

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
      accessorKey: "total",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>${row.getValue("total")}</div>,
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

  const filteredOrders = statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter)

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Orders" description="Manage your medicine orders" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredOrders} searchKey="orderNumber" searchPlaceholder="Filter orders..." />

      {/* View Order Dialog */}
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
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price}</TableCell>
                          <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

