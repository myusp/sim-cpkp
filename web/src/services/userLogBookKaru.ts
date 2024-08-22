import { UserLogbookKaruCreateRequest, UserLogbookKaruUpdateRequest } from "app-type/request";
import axiosInstance from "./common";
import { UserLogbookKaruResponse } from "app-type/response";

// Fungsi untuk mengirimkan jawaban logbook karu
export const submitLogbookKaru = async (data: UserLogbookKaruCreateRequest): Promise<UserLogbookKaruResponse> => {
    try {
        const resp = await axiosInstance.post<UserLogbookKaruResponse>('/api/logbook-karu/create-answer', data);
        return resp.data;
    } catch (error) {
        console.error('Error submitting logbook karu:', error);
        throw error;
    }
};

// Fungsi untuk memperbarui jawaban logbook karu
export const updateLogbookKaru = async (data: UserLogbookKaruUpdateRequest): Promise<UserLogbookKaruResponse> => {
    try {
        const resp = await axiosInstance.post<UserLogbookKaruResponse>('/api/logbook-karu/update-answer', data);
        return resp.data;
    } catch (error) {
        console.error('Error updating logbook karu:', error);
        throw error;
    }
};

// Fungsi untuk mendapatkan daftar logbook karu
export const listLogbookKaru = async (params: { email?: string }): Promise<UserLogbookKaruResponse[]> => {
    try {
        const resp = await axiosInstance.get<UserLogbookKaruResponse[]>('/api/logbook-karu/list', {
            params: {
                ...params
            }
        });
        return resp.data;
    } catch (error) {
        console.error('Error fetching logbook karu list:', error);
        throw error;
    }
};

// Fungsi untuk melihat detail logbook karu
// export const viewLogbookKaru = async (param: UserLogbookKaruParams): Promise<UserLogbookKaruViewResponse> => {
//     try {
//         const resp = await axiosInstance.get<UserLogbookKaruViewResponse>('/api/logbook-karu/view/' + param.id);
//         return resp.data;
//     } catch (error) {
//         console.error('Error fetching logbook karu details:', error);
//         throw error;
//     }
// };
