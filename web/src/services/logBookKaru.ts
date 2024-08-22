
import { MasterLogBookKaruCreateRequest, MasterLogBookKaruUpdateRequest } from "app-type/request";
import { MasterLogBookKaruResponse, MasterLogBookKaruActiveResponse, ListAssesmenLogBookResponse } from "app-type/response";
import axiosInstance from "./common";

// Fungsi untuk mendapatkan daftar semua logbook
export const getLogBookKaru = async (): Promise<MasterLogBookKaruResponse[]> => {
    try {
        const response = await axiosInstance.get<MasterLogBookKaruResponse[]>('/api/log-book-karu/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching logbook:', error);
        throw error;
    }
};

// Fungsi untuk mendapatkan logbook berdasarkan ID
export const getLogBookKaruById = async (id: number): Promise<MasterLogBookKaruResponse> => {
    try {
        const response = await axiosInstance.get<MasterLogBookKaruResponse>(`/api/log-book-karu/by-id/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching logbook with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menambahkan logbook baru
export const addLogBookKaru = async (data: MasterLogBookKaruCreateRequest): Promise<MasterLogBookKaruResponse> => {
    try {
        const response = await axiosInstance.post<MasterLogBookKaruResponse>('/api/log-book-karu', data);
        return response.data;
    } catch (error) {
        console.error('Error adding logbook:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui logbook
export const updateLogBookKaru = async (id: number, data: MasterLogBookKaruUpdateRequest): Promise<MasterLogBookKaruResponse> => {
    try {
        const response = await axiosInstance.put<MasterLogBookKaruResponse>(`/api/log-book-karu/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating logbook with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk menghapus logbook
export const deleteLogBookKaru = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/log-book-karu/by-id/${id}`);
    } catch (error) {
        console.error(`Error deleting logbook with ID ${id}:`, error);
        throw error;
    }
};

// Fungsi untuk mendapatkan daftar logbook aktif dengan status = 1
export const getActiveLogBookKaru = async (): Promise<MasterLogBookKaruActiveResponse[]> => {
    try {
        const response = await axiosInstance.get<MasterLogBookKaruActiveResponse[]>('/api/log-book-karu/active');
        return response.data;
    } catch (error) {
        console.error('Error fetching active logbook:', error);
        throw error;
    }
};


export const getListAssesmenLogBook = async (params: { email?: string, ruanganRSId?: string, rumahSakitId?: string, statusLogBook?: string }): Promise<ListAssesmenLogBookResponse> => {
    try {
        const response = await axiosInstance.get<ListAssesmenLogBookResponse>('/api/log-book-karu/assesmen/list', {
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching active logbook:', error);
        throw error;
    }
};


