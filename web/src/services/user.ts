import { UserByEmailResponse, UserDetailResponse, UserResponse } from "app-type/response";
import axiosInstance from "./common";
import { Akun } from "app-type/index";
import { UpdateUserRequest } from "app-type/request";

export const userDetailService = async (): Promise<UserDetailResponse> => {
    try {
        // Make a POST request to the login endpoint
        const response = await axiosInstance.get<UserDetailResponse>('/api/user');

        // Return the response data (which should be in the format of LoginResponse)
        return response.data;
    } catch (error) {
        // Handle error, either by rethrowing it or handling it accordingly
        console.error('Login service error:', error);
        throw error; // Rethrow the error so it can be handled by the caller
    }
};

export const userServiceByEmail = async (email: string): Promise<UserByEmailResponse> => {
    try {
        // Make a POST request to the login endpoint
        const response = await axiosInstance.get<UserByEmailResponse>('/api/user/by-email?email=' + window.encodeURI(email));

        // Return the response data (which should be in the format of LoginResponse)
        return response.data;
    } catch (error) {
        // Handle error, either by rethrowing it or handling it accordingly
        console.error('Login service error:', error);
        throw error; // Rethrow the error so it can be handled by the caller
    }
};

// Fungsi untuk mendapatkan daftar user
export const getUsersService = async (filters: {
    keyword?: string;
    rumahSakitId?: string;
    ruanganId?: string;
    role?: string;
}): Promise<UserResponse[]> => {
    try {
        const response = await axiosInstance.get<UserResponse[]>('/api/user/search', {
            params: filters,  // Mengirimkan filters sebagai query params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Fungsi untuk menambahkan user baru
export const addUserService = async (data: Akun): Promise<UserResponse> => {
    try {
        const response = await axiosInstance.post<UserResponse>('/api/user/create', data);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui user
export const updateUserService = async (email: string, data: UpdateUserRequest): Promise<UserResponse> => {
    try {
        const response = await axiosInstance.put<UserResponse>(`/api/user/update`, {
            ...data,
            email,
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Fungsi untuk menghapus user
export const deleteUserService = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/api/users/delete/${id}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const resetUserPasswordService = async (userId: string, newPassword: string): Promise<void> => {
    try {
        await axiosInstance.put('/api/user/reset-password', {
            email: userId,  // Menggunakan email atau user ID sebagai identifier
            newPassword,    // Mengirimkan password baru ke API
        });
    } catch (error) {
        console.error('Error resetting user password:', error);
        throw error;
    }
};