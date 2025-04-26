import axios from "axios";
import type { Category } from "@/types";

const API_URL = "http://localhost:3002/api/v1/category/";

export const categoryService = {
  async getCategories() {
    const res = await axios.get(API_URL);
    return res.data;
  },


  async createCategory(data: Omit<Category, "id">) {
    const res = await axios.post(API_URL, {
      catName: data.name,
    });

    const newCat = res.data?.data;
    return {
      id: newCat.catId.toString(),
      name: newCat.catName,
    };
  },

  async updateCategory(id: string, data: Category) {
    const res = await axios.put(`${API_URL}${id}`, {
      catName: data.name,
    });

    const updatedCat = res.data?.data;
    return {
      id: updatedCat.catId.toString(),
      name: updatedCat.catName,
    };
  },

  async deleteCategory(id: string) {
    await axios.delete(`${API_URL}${id}`);
    return true;
  },
};
