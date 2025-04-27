"use client"

import { useEffect, useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"

interface Staff {
    id: string
    name: string
    email: string
    role: string
    department: string
    status: string
}

export default function StaffsPage() {
    const [staffs, setStaffs] = useState<Staff[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)

    useEffect(() => {
        // Simulate fetching staff data
        const mockStaffs: Staff[] = [
            {
                id: "1",
                name: "John Doe",
                email: "john@medical.com",
                role: "Doctor",
                department: "Cardiology",
                status: "active"
            },
            // Add more mock data as needed
        ]
        setStaffs(mockStaffs)
        setIsLoading(false)
    }, [])

    const columns: ColumnDef<Staff>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "role",
            header: "Role",
        },
        {
            accessorKey: "department",
            header: "Department",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <StatusBadge status={row.getValue("status")} variant="staff" />
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        setCurrentStaff(row.original)
                        setIsViewDialogOpen(true)
                    }}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                </Button>
            ),
        },
    ]

    if (error) {
        return (
            <div className="flex flex-col gap-4">
                <PageHeader title="Staff" description="Manage medical staff" />
                <div className="text-center text-red-500 p-4">Error: {error}</div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <PageHeader title="Staff" description="Manage medical staff" />
                <div className="text-center p-4">Loading staff data...</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Staff" description="Manage medical staff" />

            <DataTable columns={columns} data={staffs} searchKey="name" searchPlaceholder="Filter staff..." />

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Staff Details</DialogTitle>
                        <DialogDescription>Detailed information about the selected staff member</DialogDescription>
                    </DialogHeader>
                    {currentStaff && (
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Name</p>
                                            <p className="text-sm">{currentStaff.name}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-sm">{currentStaff.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Status</p>
                                            <StatusBadge status={currentStaff.status} variant="staff" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Work Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Role</p>
                                            <p className="text-sm">{currentStaff.role}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Department</p>
                                            <p className="text-sm">{currentStaff.department}</p>
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