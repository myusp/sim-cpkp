import axiosInstance from "./common";

export type SearchRekomendasiRespons = Array<{
    id: string
    score: number
    created_at: string
    updated_at: string
    Akun: {
        email: string
        nama: string
    }
    AkunPerawat: {
        email: string
        nama: string
        MasterRuanganRS: {
            id: string
            nama: string
            id_rs: string
        }
        masterRuanganRSId: string
    }
    UserRekomendasiKainstal: Array<{
        id: number
        id_user_penilaian_karu: string
        idMasterRumahSakit: string
        idMasterRuanganRS: string
        total_scrore_skp1: number
        total_scrore_skp2: number
        total_scrore_skp3: number
        total_scrore_skp4: number
        total_scrore_skp5: number
        total_scrore_skp6: number
        email_user_kainstall: string
        feedback_to_karu: string
        email_user_kakomwat: never
        submited_at: string
        approved_at: never
        status_approval: string
    }>
}>

export type detailRekomendasiByIdPenilaianResponse = {
    penilaiankaru: {
        id: string
        email: string
        score: number
        idMasterPenilaianKaru: string
        created_at: string
        updated_at: string
        email_perawat: string
        tanggal: never
        userRekomendasiKainstalId: never
        Akun: {
            iduser: string
            email: string
            password: string
            last_login: string
            nama: string
            role: string
            pendidikanTerakhir: string
            unitTempatBekerjaTerakhir: never
            userId: never
            masterRumahSakitId: string
            masterRuanganRSId: string
            created_at: string
        }
        AkunPerawat: {
            iduser: string
            email: string
            password: string
            last_login: string
            nama: string
            role: string
            pendidikanTerakhir: string
            unitTempatBekerjaTerakhir: never
            userId: never
            masterRumahSakitId: string
            masterRuanganRSId: string
            created_at: string
        }
    }
    rekomendasi?: {
        id: number
        id_user_penilaian_karu: string
        idMasterRumahSakit: string
        idMasterRuanganRS: string
        total_scrore_skp1: number
        total_scrore_skp2: number
        total_scrore_skp3: number
        total_scrore_skp4: number
        total_scrore_skp5: number
        total_scrore_skp6: number
        email_user_kainstall: string
        feedback_to_karu: string
        email_user_kakomwat: never
        submited_at: string
        approved_at: never
        status_approval: string
    }
    score: {
        SKP1: number
        SKP2: number
        SKP3: number
        SKP4: number
        SKP5: number
        SKP6: number
    }
    tanggal_asesmen: string[]
}



export const searchRekomendasi = async (params: { rsId?: string; karu?: string; status?: string }): Promise<SearchRekomendasiRespons> => {
    try {
        const response = await axiosInstance.get<SearchRekomendasiRespons>('/api/rekomendasi-kainstal/search', {
            params,  // Pass the params object as query parameters
        });
        return response.data;
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        throw error;
    }
};

export const detailRekomendasiByIdPenilaian = async (id: string): Promise<detailRekomendasiByIdPenilaianResponse> => {
    try {
        const response = await axiosInstance.get<detailRekomendasiByIdPenilaianResponse>('/api/rekomendasi-kainstal/by-id-penilaian/' + id);
        return response.data;
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        throw error;
    }
};

export const submitFeedbackRekomendasiByIdPenilaian = async (data: { penilaianId: string, feedback: string, user: string }): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.post<{ message: string }>('/api/rekomendasi-kainstal/submit-feedback', data);
        return response.data;
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        throw error;
    }
};

export const submitRekomendasiByIdPenilaian = async (data: { penilaianId: string, feedback: string, user: string }): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.post<{ message: string }>('/api/rekomendasi-kainstal/submit-rekomendasi', data);
        return response.data;
    } catch (error) {
        console.error('Gagal mengambil data:', error);
        throw error;
    }
};
