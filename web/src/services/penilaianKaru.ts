import { MasterPenilaianKaruCreateRequest, MasterPenilaianKaruUpdateRequest } from "app-type/request";
import { MasterPenilaianKaruResponse, MasterPenilaianKaruActiveResponse } from "app-type/response";
import axiosInstance from "./common";

// Fungsi untuk mendapatkan daftar semua penilaian
export const getPenilaianKaru = async (): Promise<MasterPenilaianKaruResponse[]> => {
    try {
        const response = await axiosInstance.get<MasterPenilaianKaruResponse[]>('/api/penilaian-karu/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching penilaian:', error);
        throw error;
    }
};

// Fungsi untuk mendapatkan penilaian berdasarkan ID
export const getPenilaianKaruById = async (id: number): Promise<MasterPenilaianKaruResponse> => {
    try {
        const response = await axiosInstance.get<MasterPenilaianKaruResponse>(`/api/penilaian-karu/by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching penilaian with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menambahkan penilaian baru
export const addPenilaianKaru = async (data: MasterPenilaianKaruCreateRequest): Promise<MasterPenilaianKaruResponse> => {
    try {
        const response = await axiosInstance.post<MasterPenilaianKaruResponse>('/api/penilaian-karu', data);
        return response.data;
    } catch (error) {
        console.error('Error adding penilaian:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui penilaian
export const updatePenilaianKaru = async (id: number, data: MasterPenilaianKaruUpdateRequest): Promise<MasterPenilaianKaruResponse> => {
    try {
        const response = await axiosInstance.put<MasterPenilaianKaruResponse>(`/api/penilaian-karu/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating penilaian with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menghapus penilaian
export const deletePenilaianKaru = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/penilaian-karu/by-id/${id}`);
    } catch (error) {
        console.error(`Error deleting penilaian with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk mendapatkan daftar penilaian aktif dengan status = 1
export const getActivePenilaianKaru = async (): Promise<MasterPenilaianKaruActiveResponse[]> => {
    try {
        const response = await axiosInstance.get<MasterPenilaianKaruActiveResponse[]>('/api/penilaian-karu/active');
        return response.data;
    } catch (error) {
        console.error('Error fetching active penilaian:', error);
        throw error;
    }
};
