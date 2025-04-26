"use client"

import { useState, useEffect } from "react"
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
import { DataTable } from "@/components/data-table"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import type { Product } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { productService } from "@/services"
import { categoryService } from "@/services/category-service"

interface ApiProductImage {
  id: number;
  imageUrl: string;
}

interface ApiProduct {
  proId: number;
  proName: string;
  proDescription: string;
  proPrice: string;
  proStock: number;
  proStatus: string;
  catId: number;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  images: ApiProductImage[];
}

interface ApiResponse {
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  products: ApiProduct[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<(Product & { image?: File | string }) | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null); // Keep track of the original product before edits
  const [newProduct, setNewProduct] = useState<Omit<Product, "id"> & { image?: File | null }>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    status: "in-stock",
    image: null,
  });
  const { toast } = useToast();

  // First fetch categories, then fetch products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        // First fetch categories
        const response = await categoryService.getCategories();
        console.log("Categories response:", response);
        
        // Ensure we access the correct field in the API response
        const categoryData = response.categories || []; // Adjust based on actual API response structure
        
        const transformedCategories = categoryData.map((category: any) => ({
          id: category.catId.toString(),
          name: category.catName,
        }));
        
        setCategories(transformedCategories);
        console.log("Transformed categories:", transformedCategories);
        
        // Then fetch products
        await fetchProducts(transformedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching categories.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };
    
    fetchCategoriesAndProducts();
  }, [toast]);
  
  const fetchProducts = async (categoriesList = categories) => {
    setLoading(true);
    try {
      const response = await productService.getProduct();
      const typedResponse = response as unknown as ApiResponse;
      
      if (typedResponse && Array.isArray(typedResponse.products)) {
        const transformedProducts = typedResponse.products.map((product) => {
          const categoryId = product.catId.toString();
          const category = categoriesList.find(cat => cat.id === categoryId);
          
          return {
            id: product.proId.toString(),
            name: product.proName,
            description: product.proDescription,
            price: parseFloat(product.proPrice),
            stock: product.proStock,
            category: categoryId, // Store category ID for proper editing
            categoryName: category?.name || "Unknown",
            status: product.proStatus as "in-stock" | "low-stock" | "out-of-stock",
            image: product.images?.[0]?.imageUrl || "",
          };
        });
        
        console.log("Transformed products with categories:", transformedProducts);
        setProducts(transformedProducts);
      } else {
        console.warn("Unexpected response format:", response);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category || newProduct.price <= 0 || newProduct.stock < 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields with valid values",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("proName", newProduct.name);
      formData.append("proDescription", newProduct.description);
      formData.append("proPrice", newProduct.price.toString());
      formData.append("proStock", newProduct.stock.toString());
      formData.append("proStatus", newProduct.status);
      formData.append("catId", newProduct.category);
      if (newProduct.image) {
        formData.append("images", newProduct.image); // Append the image file
      }

      await productService.createProduct(formData);
      setIsAddDialogOpen(false);

      toast({
        title: "Product added",
        description: `${newProduct.name} has been added successfully`,
      });

      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        status: "in-stock",
        image: null,
      });

      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (!currentProduct) return;

      if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0 || currentProduct.stock < 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields with valid values",
          variant: "destructive",
        });
        return;
      }

      console.log('Sending update for product:', currentProduct);

      const formData = new FormData();
      formData.append("proName", currentProduct.name);
      formData.append("proDescription", currentProduct.description);
      formData.append("proPrice", currentProduct.price.toString());
      formData.append("proStock", currentProduct.stock.toString());
      formData.append("proStatus", currentProduct.status);
      formData.append("catId", currentProduct.category);
      if (currentProduct.image && typeof currentProduct.image !== "string") {
        formData.append("images", currentProduct.image); // Append the new image file
      } else if (typeof currentProduct.image === "string") {
        formData.append("existingImagePath", currentProduct.image); // Keep the existing image path
      }

      await productService.updateProduct(currentProduct.id, formData);
      setIsEditDialogOpen(false);

      toast({
        title: "Product updated",
        description: `${currentProduct.name} has been updated successfully`,
      });

      await fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: `Failed to update product: ${
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : "An unknown error occurred"
        }`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!currentProduct) return;

      await productService.deleteProduct(currentProduct.id);
      setIsDeleteDialogOpen(false);

      toast({
        title: "Product deleted",
        description: `${currentProduct.name} has been deleted successfully`,
      });

      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the product",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.getValue("image");
        return (
          <div className="flex items-center justify-center">
            {imageUrl ? (
              <img
                src={`http://localhost:3002/${imageUrl}`} // Adjust base URL if needed
                alt="Product"
                className="h-12 w-12 object-cover rounded"
              />
            ) : (
              <span>No Image</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "categoryName", // Display the category name
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("categoryName")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
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
        );
      },
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <StatusBadge status={row.getValue("status")} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                // Save both the current and original product state
                setCurrentProduct({...product});
                setOriginalProduct({...product});
                setIsEditDialogOpen(true);
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
                setCurrentProduct(product);
                setIsDeleteDialogOpen(true);
              }}
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewProduct({ ...newProduct, image: file }); // Store the file in the state
                    }
                  }}
                  className="bg-background/60 focus:bg-background transition-colors"
                />
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

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <span>Loading...</span>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={products} 
          searchKey="name" 
          searchPlaceholder="Filter products..." 
        />
      )}

      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            // Reset any file input state when dialog closes
            if (currentProduct && originalProduct && 'image' in originalProduct && typeof originalProduct.image === 'string') {
              setCurrentProduct({
                ...currentProduct,
                image: typeof currentProduct.image === 'string' ? currentProduct.image : originalProduct.image
              });
            }
          }
          setIsEditDialogOpen(open);
        }}
      >
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
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
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
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Image</Label>

                {/* Show current image */}
                {currentProduct.image && typeof currentProduct.image === 'string' && (
                  <div className="mb-2">
                    <p className="text-sm text-muted-foreground">Current image:</p>
                    <img
                      src={`http://localhost:3002/${currentProduct.image}`}
                      alt="Current product"
                      className="h-20 w-20 object-cover rounded mt-1"
                    />
                  </div>
                )}

                {/* Image upload input */}
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setCurrentProduct({ ...currentProduct, image: file as File });
                    }
                  }}
                  className="bg-background/60 focus:bg-background transition-colors"
                />
                <p className="text-xs text-muted-foreground">Leave empty to keep current image</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              // Reset to original state if cancel is clicked
              if (originalProduct) {
                setCurrentProduct({...originalProduct});
              }
              setIsEditDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
  );
}