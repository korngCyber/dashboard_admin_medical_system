"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockCustomers } from "@/lib/mock-data"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import type { Customer } from "@/types"

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(mockCustomers)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Orders
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("totalOrders")}</div>,
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Total Spent
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>${row.getValue("totalSpent")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentCustomer(customer)
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

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Customers" description="Manage your customers" />

      <DataTable columns={columns} data={customers} searchKey="name" searchPlaceholder="Filter customers..." />

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Detailed information about the selected customer</DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm">{currentCustomer.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{currentCustomer.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm">{currentCustomer.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm">{currentCustomer.address}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Total Orders</p>
                      <p className="text-sm">{currentCustomer.totalOrders}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Total Spent</p>
                      <p className="text-sm">${currentCustomer.totalSpent}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Order</p>
                      <p className="text-sm">2 days ago</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Customer Since</p>
                      <p className="text-sm">Jan 15, 2023</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>The most recent orders placed by this customer</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>#ORD-1234</TableCell>
                        <TableCell>Apr 2, 2023</TableCell>
                        <TableCell>Delivered</TableCell>
                        <TableCell>$125.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD-1235</TableCell>
                        <TableCell>Mar 15, 2023</TableCell>
                        <TableCell>Delivered</TableCell>
                        <TableCell>$85.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>#ORD-1236</TableCell>
                        <TableCell>Feb 28, 2023</TableCell>
                        <TableCell>Delivered</TableCell>
                        <TableCell>$210.25</TableCell>
                      </TableRow>
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

