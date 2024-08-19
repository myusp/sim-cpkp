import { Akun, MasterPertanyaanAssesmen, MasterRuanganRS, MasterRumahSakit, User, UserAssesmen, UserCPD_PK1, UserCPD_PK2, UserCPD_PK3, UserCPD_PK4, UserCPD_PK5, UserOrientasi, UserPelatihan } from "."

export type LoginResponse = {
    token: string
}

export type UserDetailResponse = {
    email: string
    iduser: string
    role: string
    last_login: string
    pendidikanTerakhir: unknown
    unitTempatBekerjaTerakhir: unknown
    MasterRuanganRS: unknown
    masterRumahSakitId: unknown
    created_at: string
    nama: string
}

export type HospitalResponse = {
    id: string;
    nama: string;
};

export type RoomResponse = {
    id: string;
    nama: string;
    id_rs: string;
};

export type CpdResponse = {
    id: number;
    value: string;
    pk: 'pk1' | 'pk2' | 'pk3' | 'pk4' | 'pk5';
};


export type CpdListResponse = CpdResponse[]

export type ErrorResponse = {
    error: string;
};


export type UserResponse = {
    iduser: string;
    email: string;
    nama: string;
    role: string;
    pendidikanTerakhir?: string;
    unitTempatBekerjaTerakhir?: string;
    created_at: Date;
    masterRumahSakitId?: string;
    masterRuanganRSId?: string;
};


export type UpdateUserResponse = {
    email: string
    akun: Akun
    user: User
    cpd_pk1: number[]
    cpd_pk2: number[]
    cpd_pk3: number[]
    cpd_pk4: number[]
    cpd_pk5: number[]
    orientasi: number[]
    pelatihan: number[]
}

export type UserResetPassResponse = {
    message: string;
};

export type UserSearchResponse = Akun[];

// Menggabungkan tipe-tipe yang telah didefinisikan sebelumnya menjadi satu tipe composite
export interface UserByEmailResponse {
    email: string;
    iduser: string;
    role: string;
    last_login: Date | null;
    pendidikanTerakhir: string;
    unitTempatBekerjaTerakhir: string | null;
    masterRuanganRSId: string;
    MasterRuanganRS: MasterRuanganRS;
    masterRumahSakitId: string;
    MasterRumahSakit: MasterRumahSakit;
    created_at: Date;
    User: UserDetails; // Berisi data user detail termasuk CPD, orientasi, pelatihan, dll.
}

// Menggabungkan bagian-bagian yang ada dalam User
export interface UserDetails extends User {
    cpdForPK1: UserCPD_PK1[];
    cpdForPK2: UserCPD_PK2[];
    cpdForPK3: UserCPD_PK3[];
    cpdForPK4: UserCPD_PK4[];
    cpdForPK5: UserCPD_PK5[];
    orientasiYangDiikuti: UserOrientasi[];
    pelatihanYangDiikuti: UserPelatihan[];
}


export type MasterPertanyaanResponse = MasterPertanyaanAssesmen;

export type MasterPertanyaanActiveResponse = Omit<MasterPertanyaanAssesmen, 'vokasi' | 'ners'>;

export interface UserAssessmentResponse {
    id: string;
    skp_1: number;
    skp_2: number;
    skp_3: number;
    skp_4: number;
    skp_5: number;
    skp_6: number;
    id_master_pertanyaans: string[];
    answers: { id: number, answer: string }[];
}

export interface UserAssessmentViewResponse {
    assesmen: UserAssesmen
    answer: { answer: string, id: number }[],
    questions: Omit<MasterPertanyaanAssesmen, "created_at" | "updated_at" | "status">[]
}

export interface UserAssessmentListResponse {
    data: { assesmen: UserAssesmen, akun: Akun & { MasterRumahSakit?: MasterRumahSakit, MasterRuanganRS?: MasterRuanganRS } }[]
}
