import { MasterPelatihan } from "app-type/index";
import axiosInstance from "./common";

// Fungsi untuk mendapatkan daftar pelatihan
export const getPelatihan = async (): Promise<MasterPelatihan[]> => {
    try {
        const response = await axiosInstance.get<MasterPelatihan[]>('/api/pelatihan/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching pelatihan:', error);
        throw error;
    }
};

// Fungsi untuk menambahkan pelatihan baru
export const addPelatihan = async (data: { value: string }): Promise<MasterPelatihan> => {
    try {
        const response = await axiosInstance.post<MasterPelatihan>('/api/pelatihan', data);
        return response.data;
    } catch (error) {
        console.error('Error adding pelatihan:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui pelatihan
export const updatePelatihan = async (id: number, data: { value: string }): Promise<MasterPelatihan> => {
    try {
        const response = await axiosInstance.put<MasterPelatihan>(`/api/pelatihan/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating pelatihan:', error);
        throw error;
    }
};

// Fungsi untuk menghapus pelatihan
export const deletePelatihan = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/pelatihan/by-id/${id}`);
    } catch (error) {
        console.error('Error deleting pelatihan:', error);
        throw error;
    }
};
