
import { MasterOrientasi } from "app-type/index";
import axiosInstance from "./common";

// Fungsi untuk mendapatkan daftar orientasi
export const getOrientasi = async (): Promise<MasterOrientasi[]> => {
    try {
        const response = await axiosInstance.get<MasterOrientasi[]>('/api/orientasi/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching orientasi:', error);
        throw error;
    }
};

// Fungsi untuk menambahkan orientasi baru
export const addOrientasi = async (data: { value: string }): Promise<MasterOrientasi> => {
    try {
        const response = await axiosInstance.post<MasterOrientasi>('/api/orientasi', data);
        return response.data;
    } catch (error) {
        console.error('Error adding orientasi:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui orientasi
export const updateOrientasi = async (id: number, data: { value: string }): Promise<MasterOrientasi> => {
    try {
        const response = await axiosInstance.put<MasterOrientasi>(`/api/orientasi/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating orientasi:', error);
        throw error;
    }
};

// Fungsi untuk menghapus orientasi
export const deleteOrientasi = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/orientasi/by-id/${id}`);
    } catch (error) {
        console.error('Error deleting orientasi:', error);
        throw error;
    }
};
