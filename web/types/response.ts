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
