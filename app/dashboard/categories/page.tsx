"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { mockCategories } from "@/lib/mock-data"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import type { Category } from "@/types"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<Omit<Category, "id" | "productCount">>({
    name: "",
    description: "",
  })
  const { toast } = useToast()

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "productCount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Products
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("productCount")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentCategory(category)
                setIsEditDialogOpen(true)
              }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentCategory(category)
                setIsDeleteDialogOpen(true)
              }}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  const handleAddCategory = () => {
    try {
      // Validate form
      if (!newCategory.name) {
        toast({
          title: "Validation Error",
          description: "Please enter a category name",
          variant: "destructive",
        })
        return
      }

      const id = Math.random().toString(36).substring(2, 9)
      const category = { id, ...newCategory, productCount: 0 }
      setCategories([...categories, category])
      setNewCategory({
        name: "",
        description: "",
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Category added",
        description: `${category.name} has been added successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the category",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategory = () => {
    try {
      if (!currentCategory) return

      // Validate form
      if (!currentCategory.name) {
        toast({
          title: "Validation Error",
          description: "Please enter a category name",
          variant: "destructive",
        })
        return
      }

      const updatedCategories = categories.map((category) =>
        category.id === currentCategory.id ? currentCategory : category,
      )

      setCategories(updatedCategories)
      setIsEditDialogOpen(false)
      toast({
        title: "Category updated",
        description: `${currentCategory.name} has been updated successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = () => {
    try {
      if (!currentCategory) return

      const filteredCategories = categories.filter((category) => category.id !== currentCategory.id)

      setCategories(filteredCategories)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Category deleted",
        description: `${currentCategory.name} has been deleted successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the category",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Categories" description="Manage your product categories">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Fill in the details to add a new category</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <DataTable columns={columns} data={categories} searchKey="name" searchPlaceholder="Filter categories..." />

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the details of the selected category</DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentCategory.name}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentCategory && (
            <div className="py-4">
              <p>
                You are about to delete <strong>{currentCategory.name}</strong>.
              </p>
              {currentCategory.productCount > 0 && (
                <p className="text-destructive mt-2">
                  Warning: This category contains {currentCategory.productCount} products. Deleting this category will
                  not delete the associated products.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

