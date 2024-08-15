export type JwtPayload = {
    email: string
    name: string
    role: string
    id_rs: string | null
    id_ruangan: string | null

    created: number
    iat?: number,
    exp?: number
}

export interface User {
    id: string;
    jenisKelamin?: string;
    alamatDomisili?: string;
    alamatTinggal?: string;
    mulaiBergabungRS?: Date;
    mulaiBekerjaUnitTerakhir?: Date;
    statusKepegawaian?: string;
    asalInstitusiPendidikan?: string;
    kelulusanTahun?: number;
    tanggalTerbitSTR?: Date;
    tanggalBerakhirSTR?: string;
    tanggalTerbitSIPP?: Date;
    jabatanSaatIni?: string;
    levelPKSaatIni?: string;
    levelPKYangDiajukan?: string;
    levelPerawatManajer?: string;
    programMutuRCA: boolean;
    setuju: boolean;
}

export interface Akun {
    iduser: string;
    email: string;
    password: string;
    last_login?: Date;
    nama: string;
    created_at: Date;
    role: string;
    pendidikanTerakhir?: string;
    unitTempatBekerjaTerakhir?: string;
    userId?: string;
    masterRumahSakitId?: string;
    masterRuanganRSId?: string;
}

export interface MasterRumahSakit {
    id: string;
    nama: string;
}

export interface MasterRuanganRS {
    id: string;
    nama: string;
    id_rs: string;
}

export interface MasterOrientasi {
    id: number;
    value: string;
}

export interface MasterPelatihan {
    id: number;
    value: string;
}

export interface MasterCPD_PK1 {
    id: number;
    value: string;
}

export interface MasterCPD_PK2 {
    id: number;
    value: string;
}

export interface MasterCPD_PK3 {
    id: number;
    value: string;
}

export interface MasterCPD_PK4 {
    id: number;
    value: string;
}

export interface MasterCPD_PK5 {
    id: number;
    value: string;
}

export interface UserOrientasi {
    id: string;
    userId: string;
    orientasiId: number;
}

export interface UserPelatihan {
    id: string;
    userId: string;
    pelatihanId: number;
}

export interface UserCPD_PK1 {
    id: number;
    userId: string;
    cpdId: number;
}

export interface UserCPD_PK2 {
    id: number;
    userId: string;
    cpdId: number;
}

export interface UserCPD_PK3 {
    id: number;
    userId: string;
    cpdId: number;
}

export interface UserCPD_PK4 {
    id: number;
    userId: string;
    cpdId: number;
}

export interface UserCPD_PK5 {
    id: number;
    userId: string;
    cpdId: number;
}

export interface MasterPertanyaanAssesmen {
    id: number;
    skp?: string;
    sub_kategori?: string;
    kode?: string;
    keterampilan?: string;
    vokasi?: string;
    ners?: string;
    tipe?: string;
    priority?: number;
    status: number;
    created_at: Date;
    updated_at: Date;
}

export interface UserAssesmen {
    id: string;
    tanggal: Date;
    skp_1?: string;
    skp_2?: string;
    skp_3?: string;
    skp_4?: string;
    skp_5?: string;
    skp_6?: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserJawabanAsesmen {
    id: number;
    jawaban: string;
    skor: number;
    created_at: Date;
    UserAssesmenId: string;
    MasterPertanyaanAssesmenId: number;
}

export interface MasterKeterampilanDiagnosis {
    id: string;
    nama_kompetensi: string;
}

export interface MasterKeterampilanIntervensi {
    id: string;
    nama_kompetensi: string;
}
