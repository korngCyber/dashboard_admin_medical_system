"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { mockProducts, mockCategories } from "@/lib/mock-data"
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import type { Product } from "@/types"
import { Textarea } from "@/components/ui/textarea"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    status: "in-stock",
  })
  const { toast } = useToast()

  const columns: ColumnDef<Product>[] = [
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium text-primary">${row.getValue("price")}</div>,
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Stock
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} />
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentProduct(product)
                setIsEditDialogOpen(true)
              }}
              className="h-8 w-8 rounded-full"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentProduct(product)
                setIsDeleteDialogOpen(true)
              }}
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const handleAddProduct = () => {
    try {
      // Validate form
      if (!newProduct.name || !newProduct.category) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const id = Math.random().toString(36).substring(2, 9)
      const product = { id, ...newProduct }
      setProducts([...products, product])
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        status: "in-stock",
      })
      setIsAddDialogOpen(false)
      toast({
        title: "Product added",
        description: `${product.name} has been added successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the product",
        variant: "destructive",
      })
    }
  }

  const handleUpdateProduct = () => {
    try {
      if (!currentProduct) return

      // Validate form
      if (!currentProduct.name || !currentProduct.category) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const updatedProducts = products.map((product) => (product.id === currentProduct.id ? currentProduct : product))

      setProducts(updatedProducts)
      setIsEditDialogOpen(false)
      toast({
        title: "Product updated",
        description: `${currentProduct.name} has been updated successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = () => {
    try {
      if (!currentProduct) return

      const filteredProducts = products.filter((product) => product.id !== currentProduct.id)

      setProducts(filteredProducts)
      setIsDeleteDialogOpen(false)
      toast({
        title: "Product deleted",
        description: `${currentProduct.name} has been deleted successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the product",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Products" description="Manage your medical products">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Fill in the details to add a new product</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="bg-background/60 focus:bg-background transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="bg-background/60 focus:bg-background transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })}
                    className="bg-background/60 focus:bg-background transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })}
                    className="bg-background/60 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger className="bg-background/60 focus:bg-background transition-colors">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newProduct.status}
                    onValueChange={(value: "in-stock" | "low-stock" | "out-of-stock") =>
                      setNewProduct({ ...newProduct, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background/60 focus:bg-background transition-colors">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleAddProduct}>
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <DataTable columns={columns} data={products} searchKey="name" searchPlaceholder="Filter products..." />

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details of the selected product</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  className="bg-background/60 focus:bg-background transition-colors"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  className="bg-background/60 focus:bg-background transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={currentProduct.price}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="bg-background/60 focus:bg-background transition-colors"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={currentProduct.stock}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, stock: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-background/60 focus:bg-background transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => setCurrentProduct({ ...currentProduct, category: value })}
                  >
                    <SelectTrigger className="bg-background/60 focus:bg-background transition-colors">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={currentProduct.status}
                    onValueChange={(value: "in-stock" | "low-stock" | "out-of-stock") =>
                      setCurrentProduct({ ...currentProduct, status: value })
                    }
                  >
                    <SelectTrigger className="bg-background/60 focus:bg-background transition-colors">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="py-4">
              <p>
                You are about to delete <strong className="text-primary">{currentProduct.name}</strong>.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

