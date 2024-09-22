import axiosInstance from "./common";

// Fungsi untuk mendapatkan daftar notifikasi (getListNotif)

export type getNotificationsServiceResponse = Array<{
    fromKaru: {
        email: string
        nama: string
    }
    selfAsesmenDate: string
    isRead: boolean
    createdAt: string
    message: string
    id: string
}>

export const getNotificationsService = async (email: string): Promise<getNotificationsServiceResponse> => {
    try {
        const response = await axiosInstance.get<getNotificationsServiceResponse>('/api/notifications/getlistnotif', {
            params: {
                toPerawatEmail: email
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

// Fungsi untuk mendapatkan jumlah notifikasi yang belum dibaca (getCountNotif)
export const getUnreadNotificationCountService = async (email: string): Promise<number> => {
    try {
        const response = await axiosInstance.get<{ count: number }>('/api/notifications/getcountnotif', {
            params: {
                toPerawatEmail: email
            }
        });
        return response.data.count;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        throw error;
    }
};

// Fungsi untuk menandai notifikasi sebagai telah dibaca (readNotif)
export const markNotificationAsReadService = async (id: string): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.put<{ message: string }>(`/api/notifications/readnotif/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

// Fungsi untuk mengirim notifikasi baru (sendNotif)

export type sendNotificationServiceResponse = {
    id: string
    fromKaruEmail: string
    toPerawatEmail: string
    message: string
    isRead: boolean
    selfAsesmenDate: string
    createdAt: string
    updatedAt: string
}

export const sendNotificationService = async (data: { fromKaruEmail: string, toPerawatEmail: string, tgl: string }): Promise<sendNotificationServiceResponse> => {
    try {
        const response = await axiosInstance.post<sendNotificationServiceResponse>('/api/notifications/sendnotif', data);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};
