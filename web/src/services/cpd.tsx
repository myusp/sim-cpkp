import { CpdParams, CpdBody } from 'app-type/request';
import { CpdListResponse, CpdResponse } from 'app-type/response';
import axiosInstance from './common';


// Fungsi untuk mendapatkan daftar CPD berdasarkan PK (jika ada)
export const getCpdList = async (pk?: CpdParams['pk']): Promise<CpdListResponse> => {
    try {
        const response = await axiosInstance.get<CpdListResponse>('/api/master-cpd', {
            params: { pk },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching CPD list:', error);
        throw error;
    }
};

// Fungsi untuk menambahkan CPD baru
export const addCpd = async (data: CpdBody & CpdParams): Promise<CpdResponse> => {
    try {
        const response = await axiosInstance.post<CpdResponse>('/api/master-cpd', data);
        return response.data;
    } catch (error) {
        console.error('Error adding CPD:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui CPD
export const updateCpd = async (id: string, data: CpdBody & CpdParams): Promise<CpdResponse> => {
    try {
        const response = await axiosInstance.put<CpdResponse>(`/api/master-cpd/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating CPD:', error);
        throw error;
    }
};

// Fungsi untuk menghapus CPD
export const deleteCpd = async (id: string, pk: CpdParams['pk']): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/master-cpd/${id}`, {
            data: { pk },
        });
    } catch (error) {
        console.error('Error deleting CPD:', error);
        throw error;
    }
};
