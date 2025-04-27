"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Plus, ArrowUpDown } from "lucide-react"
import { staffService } from "@/services/staff-service"
import { useToast } from "@/hooks/use-toast"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import type { ColumnDef } from "@tanstack/react-table"

interface Staff {
    cusId: number
    cusName: string
    cusEmail: string
    cusPhone: string
    cusAddress: string
    cusStatus: boolean
    cusRole: string
    cusImage: string | null
    cusBio: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
}

const staffFormSchema = z.object({
    cusName: z.string().min(2, "Name must be at least 2 characters"),
    cusEmail: z.string().email("Invalid email address"),
    cusPhone: z.string().min(10, "Phone number must be at least 10 digits"),
    cusAddress: z.string().min(5, "Address must be at least 5 characters"),
    cusPassword: z.string().min(8, "Password must be at least 8 characters"),
    cusBio: z.string().optional(),
    cusImage: z.any().optional()
})

export default function StaffPage() {
    const [staffs, setStaffs] = useState<Staff[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof staffFormSchema>>({
        resolver: zodResolver(staffFormSchema),
        defaultValues: {
            cusName: "",
            cusEmail: "",
            cusPhone: "",
            cusAddress: "",
            cusPassword: "",
            cusBio: "",
        }
    })

    const columns: ColumnDef<Staff>[] = [
        {
            accessorKey: "cusName",
            header: ({ column }) => (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
        },
        {
            accessorKey: "cusEmail",
            header: "Email",
        },
        {
            accessorKey: "cusPhone",
            header: "Phone",
        },
        {
            accessorKey: "cusRole",
            header: "Role",
        },
        {
            accessorKey: "cusStatus",
            header: "Status",
            cell: ({ row }) => (
                <StatusBadge
                    status={row.getValue("cusStatus") ? "active" : "inactive"}
                    variant="staff"
                />
            ),
        },
    ]

    const fetchStaffs = async () => {
        try {
            setIsLoading(true)
            const response = await staffService.getStaffs()
            setStaffs(response.customers.filter(staff => staff.cusRole === 'staff'))
        } catch (error) {
            console.error("Failed to fetch staffs:", error)
            toast({
                title: "Error",
                description: "Failed to load staff data",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStaffs()
    }, [])

    async function onSubmit(values: z.infer<typeof staffFormSchema>) {
        try {
            const formData = new FormData()
            formData.append("cusName", values.cusName)
            formData.append("cusEmail", values.cusEmail)
            formData.append("cusPhone", values.cusPhone)
            formData.append("cusAddress", values.cusAddress)
            formData.append("cusPassword", values.cusPassword)
            formData.append("cusStatus", "true")
            formData.append("cusRole", "staff") // Add this line to set role
            formData.append("cusBio", values.cusBio || "")

            if (values.cusImage?.[0]) {
                formData.append("cusImage", values.cusImage[0])
            }

            await staffService.createStaff(formData)

            toast({
                title: "Success",
                description: "Staff member has been added successfully",
            })

            setIsAddDialogOpen(false)
            form.reset()
            fetchStaffs()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add staff member",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <PageHeader title="Staff" description="Manage medical staff" />
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="gradient">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Staff
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle>Add New Staff Member</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="cusName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cusEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cusPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cusPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cusAddress"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cusBio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cusImage"
                                    render={({ field: { onChange, ...field } }) => (
                                        <FormItem>
                                            <FormLabel>Profile Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => onChange(e.target.files)}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="gradient">
                                        Add Staff Member
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-4">
                    <span>Loading...</span>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={staffs}
                    searchKey="cusName"
                    searchPlaceholder="Filter staff..."
                />
            )}
        </div>
    )
}