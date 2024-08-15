import { Akun, User } from "."

export type LoginRequest = {
    email: string
    password: string
}

export type UserByEmailRequest = {
    email: string
}

export type UserResetPassRequest = {
    email: string
    password: string
}

export type UserSearchRequest = {
    hospital_id: number
    room_id: number
    role: string
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