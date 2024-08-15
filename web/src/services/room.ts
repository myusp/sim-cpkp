import axiosInstance from "./common";
import { MasterRuanganRS } from "app-type/index";

export const fetchAllRooms = async (): Promise<MasterRuanganRS[]> => {
    try {
        const response = await axiosInstance.get<MasterRuanganRS[]>('/api/rooms/all');
        return response.data;
    } catch (error) {
        console.error('Gagal mengambil data semua ruangan:', error);
        throw error;
    }
};
// Fungsi untuk mendapatkan daftar ruangan berdasarkan ID rumah sakit
export const getRoomsService = async (hospitalId: string): Promise<MasterRuanganRS[]> => {
    try {
        const response = await axiosInstance.get<MasterRuanganRS[]>(`/api/rooms/by-hospital/${hospitalId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching rooms:', error);
        throw error;
    }
};

// Fungsi untuk menambahkan ruangan baru
export const addRoomService = async (data: { nama: string, id_rs: string }): Promise<MasterRuanganRS> => {
    try {
        const response = await axiosInstance.post<MasterRuanganRS>('/api/rooms', data);
        return response.data;
    } catch (error) {
        console.error('Error adding room:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui ruangan
export const updateRoomService = async (id: string, data: { nama: string }): Promise<MasterRuanganRS> => {
    try {
        const response = await axiosInstance.put<MasterRuanganRS>(`/api/rooms/by-id/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating room:', error);
        throw error;
    }
};

// Fungsi untuk menghapus ruangan
export const deleteRoomService = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/rooms/by-id/${id}`);
    } catch (error) {
        console.error('Error deleting room:', error);
        throw error;
    }
};
