"use client";

import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import type { Category } from "@/types";
import { categoryService } from "@/services/category-service";

// Define the API response types based on the actual response structure
interface ApiCategory {
  catId: number;
  catName: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
}

interface ApiResponse {
  message: string;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: ApiCategory[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    name: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Get categories from service
        const response = await categoryService.getCategories();
        console.log("API Response:", response);

        // Cast response to our defined type
        const typedResponse = response as unknown as ApiResponse;

        // Extract and transform data
        if (typedResponse && Array.isArray(typedResponse.data)) {
          const transformedCategories = typedResponse.data.map((category) => ({
            id: category.catId.toString(),
            name: category.catName,
          }));

          console.log("Transformed Categories:", transformedCategories);
          setCategories(transformedCategories);
        } else {
          console.warn("Unexpected response format:", response);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching categories.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
          <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original;
        return (
            <div className="flex items-center justify-end gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => {
                    setCurrentCategory(category);
                    setIsEditDialogOpen(true);
                  }}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    setCurrentCategory(category);
                    setIsDeleteDialogOpen(true);
                  }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
        );
      },
    },
  ];

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      const addedCategory = await categoryService.createCategory(newCategory);
      console.log("Added category response:", addedCategory);

      if (addedCategory) {
        setCategories((prevCategories) => [...prevCategories, addedCategory]);
        setNewCategory({ name: "" });
        setIsAddDialogOpen(false);
        toast({
          title: "Category added",
          description: `${addedCategory.name} has been added successfully`,
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the category",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;
    if (!currentCategory.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedCategory = await categoryService.updateCategory(
          currentCategory.id,
          currentCategory
      );

      if (updatedCategory) {
        setCategories((prevCategories) =>
            prevCategories.map((category) =>
                category.id === currentCategory.id ? updatedCategory : category
            )
        );
        setIsEditDialogOpen(false);
        toast({
          title: "Category updated",
          description: `${updatedCategory.name} has been updated successfully`,
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    try {
      const success = await categoryService.deleteCategory(currentCategory.id);
      if (success) {
        setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== currentCategory.id)
        );
        setIsDeleteDialogOpen(false);
        toast({
          title: "Category deleted",
          description: `${currentCategory.name} has been deleted successfully`,
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the category",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Categories" description="Manage your product categories">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
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
                      placeholder="Enter category name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCategory}>
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2">Loading categories...</p>
              </div>
            </div>
        ) : categories.length === 0 ? (
            <div className="bg-white rounded-md p-8 text-center">
              <p className="text-gray-500">No categories found. Add your first category to get started.</p>
            </div>
        ) : (
            <DataTable
                columns={columns}
                data={categories}
                searchKey="name"
                searchPlaceholder="Filter categories..."
            />
        )}

        {/* Edit Dialog */}
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
                        onChange={(e) =>
                            setCurrentCategory({ ...currentCategory, name: e.target.value })
                        }
                    />
                  </div>
                </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateCategory}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the category "{currentCategory?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {currentCategory && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteCategory}>
                    Delete Category
                  </Button>
                </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}