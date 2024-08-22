import { Akun, MasterPertanyaanAssesmen, User } from "."

export type LoginRequest = {
    email: string
    password: string
}

export type UserByEmailRequest = {
    email: string
}

export type UserResetPassRequest = {
    email: string
    newPassword: string
}

export type UpdateUserRequest = {
    email: string
    akun: Akun
    user?: User
    cpd_pk1?: number[]
    cpd_pk2?: number[]
    cpd_pk3?: number[]
    cpd_pk4?: number[]
    cpd_pk5?: number[]
    orientasi?: number[]
    pelatihan?: number[]
}

export type RoomRequest = {
    hospital_id: string
}

export type RoomParams = {
    room_id: string;
};

export type RoomBody = {
    nama: string;
    id_rs: string;
};

export type HospitalParams = {
    hospital_id: string;
};

export type HospitalBody = {
    nama: string;
};

export type CpdParams = {
    pk: 'pk1' | 'pk2' | 'pk3' | 'pk4' | 'pk5';
};

export type CpdBody = {
    value: string;
};

export type CreateUserRequest = {
    email: string;
    password: string;
    nama: string;
    role: string;
    pendidikanTerakhir?: string;
    unitTempatBekerjaTerakhir?: string;
    userId?: string;
    masterRumahSakitId?: string;
    masterRuanganRSId?: string;
};

export type UserSearchRequest = {
    keyword?: string;         // Kata kunci untuk mencari berdasarkan nama atau email
    rumahSakitId?: string;    // ID Rumah Sakit untuk filter
    ruanganId?: string;
    role?: string;     // ID Ruangan untuk filter
};

// src/types/request.ts
export interface UserAssessmentParams {
    id: string;
}

export interface UserAssessmentCreateRequest {
    id_master_pertanyaans: string[];
    answers: { id: number, answer: string }[];
    tanggal?: string
}

export interface UserAssessmentUpdateRequest {
    id_user_assesmen: string
    answers: { id: number, answer: string }[];
}

export interface UserAssessmentListParams {
    email?: string
    rumahSakitId?: string
    ruanganRSId?: string
    statusPenilaian?: number
}


export type MasterPertanyaanCreateRequest = Omit<MasterPertanyaanAssesmen, 'id' | 'created_at' | 'updated_at'>;

export type MasterPertanyaanUpdateRequest = Partial<Omit<MasterPertanyaanAssesmen, 'created_at' | 'updated_at'>>;

export type MasterPertanyaanParams = {
    id: number;
};

export type MasterLogBookKaruCreateRequest = {
    skp: string;
    kegiatan: string;
    status?: number;
};

export type MasterLogBookKaruUpdateRequest = Partial<Omit<MasterLogBookKaruCreateRequest, 'id'>>;

export type MasterLogBookKaruParams = {
    id: number;
};

export type MasterPenilaianKaruCreateRequest = {
    kategori: string;
    penilaian: string;
    status?: number;
};

export type MasterPenilaianKaruUpdateRequest = Partial<Omit<MasterPenilaianKaruCreateRequest, 'id'>>;

export type MasterPenilaianKaruParams = {
    id: number;
};

export type UserLogbookKaruCreateRequest = {
    id_master_logbook_karus: string[];
    answers: { id: number, jawaban: number }[];
    userAsesmenId: string;
};

export type UserLogbookKaruUpdateRequest = {
    id_user_logbook_karu: string;
    answers: { id: number, jawaban: number }[];
};

export interface UserLogbookKaruListRequest {
    rumahSakitId: string
    ruanganRSId: string
}


