import { MasterPertanyaanCreateRequest, MasterPertanyaanUpdateRequest } from "app-type/request";
import { MasterPertanyaanResponse, MasterPertanyaanActiveResponse } from "app-type/response";
import axiosInstance from "./common";

// Fungsi untuk mendapatkan daftar semua pertanyaan
export const getPertanyaan = async (): Promise<MasterPertanyaanResponse[]> => {
    try {
        const response = await axiosInstance.get<MasterPertanyaanResponse[]>('/api/pertanyaan/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching pertanyaan:', error);
        throw error;
    }
};

// Fungsi untuk mendapatkan pertanyaan berdasarkan ID
export const getPertanyaanById = async (id: number): Promise<MasterPertanyaanResponse> => {
    try {
        const response = await axiosInstance.get<MasterPertanyaanResponse>(`/api/pertanyaan/by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching pertanyaan with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menambahkan pertanyaan baru
export const addPertanyaan = async (data: MasterPertanyaanCreateRequest): Promise<MasterPertanyaanResponse> => {
    try {
        const response = await axiosInstance.post<MasterPertanyaanResponse>('/api/pertanyaan', data);
        return response.data;
    } catch (error) {
        console.error('Error adding pertanyaan:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui pertanyaan
export const updatePertanyaan = async (id: number, data: MasterPertanyaanUpdateRequest): Promise<MasterPertanyaanResponse> => {
    try {
        const response = await axiosInstance.put<MasterPertanyaanResponse>(`/api/pertanyaan/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating pertanyaan with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menghapus pertanyaan
export const deletePertanyaan = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/pertanyaan/by-id/${id}`);
    } catch (error) {
        console.error(`Error deleting pertanyaan with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk mendapatkan daftar pertanyaan aktif dengan status = 1
export const getActivePertanyaan = async (): Promise<MasterPertanyaanActiveResponse[]> => {
    try {
        const response = await axiosInstance.get<MasterPertanyaanActiveResponse[]>('/api/pertanyaan/active');
        return response.data;
    } catch (error) {
        console.error('Error fetching active pertanyaan:', error);
        throw error;
    }
};
