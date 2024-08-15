import axiosInstance from "./common";
import { HospitalResponse } from "app-type/response";

// Fungsi untuk mendapatkan daftar rumah sakit
export const getHospitalsService = async (): Promise<HospitalResponse[]> => {
    try {
        const response = await axiosInstance.get<HospitalResponse[]>('/api/hospitals/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching hospitals:', error);
        throw error;
    }
};

// Fungsi untuk menambahkan rumah sakit baru
export const addHospitalService = async (data: { nama: string }): Promise<HospitalResponse> => {
    try {
        const response = await axiosInstance.post<HospitalResponse>('/api/hospitals', data);
        return response.data;
    } catch (error) {
        console.error('Error adding hospital:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui rumah sakit
export const updateHospitalService = async (id: string, data: { nama: string }): Promise<HospitalResponse> => {
    try {
        const response = await axiosInstance.put<HospitalResponse>(`/api/hospitals/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating hospital:', error);
        throw error;
    }
};

// Fungsi untuk menghapus rumah sakit
export const deleteHospitalService = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/hospitals/by-id/${id}`);
    } catch (error) {
        console.error('Error deleting hospital:', error);
        throw error;
    }
};
