"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { customerService } from "@/services/customer-service"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@/types"

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true)
        const data = await customerService.getCustomers()
        // Transform API data to match our Customer type
        const transformedCustomers = data.map((customer: any) => ({
          id: customer.cusId ? customer.cusId.toString() : "N/A", // Add a fallback value
          name: customer.cusName || "Unknown",
          email: customer.cusEmail || "N/A",
          phone: customer.cusPhone || "N/A",
          address: customer.cusAddress || "N/A",
          status: customer.cusStatus || false,
          role: customer.cusRole || "unknown",
          image: customer.cusImage || "",
          bio: customer.cusBio || "",
          createdAt: customer.created_at ? new Date(customer.created_at) : new Date(),
          updatedAt: customer.updated_at ? new Date(customer.updated_at) : new Date(),
          totalOrders: 0, // You may need to fetch this separately
          totalSpent: 0, // You may need to fetch this separately
        }))
        setCustomers(transformedCustomers)
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.image || ""} alt={row.getValue("name")} />
            <AvatarFallback>{getInitials(row.getValue("name"))}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("status") ? "success" : "destructive"}>
          {row.getValue("status") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
    },
    {
      accessorKey: "totalOrders",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Orders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("totalOrders")}</div>,
    },
    {
      accessorKey: "totalSpent",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Spent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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

  // Helper function to get initials from name
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Format date for display
  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Customers" description="Manage your customers" />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading customers...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={customers} searchKey="name" searchPlaceholder="Filter customers..." />
      )}

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Detailed information about the selected customer</DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentCustomer.image || ""} alt={currentCustomer.name} />
                  <AvatarFallback>{getInitials(currentCustomer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{currentCustomer.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={currentCustomer.status ? "success" : "destructive"}>
                      {currentCustomer.status ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {currentCustomer.role}
                    </Badge>
                  </div>
                </div>
              </div>

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
                    {currentCustomer.bio && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Bio</p>
                        <p className="text-sm">{currentCustomer.bio}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
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
                      <p className="text-sm font-medium">Customer Since</p>
                      <p className="text-sm">{formatDate(currentCustomer.createdAt)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm">{formatDate(currentCustomer.updatedAt)}</p>
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
                      {/* This section would need real order data */}
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                          No recent orders found
                        </TableCell>
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