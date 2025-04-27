import { api } from "@/services/api";
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

interface StaffResponse {
    totalItems: number
    totalPages: number
    currentPage: number
    customers: Staff[]
}

export const staffService = {
    async getStaffs(): Promise<StaffResponse> {
        try {
            const response = await api.get<StaffResponse>("/customer/staff/all");
            return response;
        } catch (error) {
            console.error("Error fetching staff:", error);
            throw error;
        }
    },
    // Get staff by ID
    async getStaffById(id: string): Promise<Staff> {
        return api.get<Staff>(`/customer/staff/${id}`);
    },

    // Create new staff member
    async createStaff(data: FormData): Promise<Staff> {
        return api.post<Staff>("/customer", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Update staff member
    async updateStaff(id: string, data: FormData): Promise<Staff> {
        return api.put<Staff>(`/customer/staff/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    // Delete staff member
    async deleteStaff(id: string): Promise<boolean> {
        await api.delete(`/customer/staff/${id}`);
        return true;
    }
};