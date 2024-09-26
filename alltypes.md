types/index.ts
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id                       String          @id @default(uuid())
  jenisKelamin             String?
  alamatDomisili           String?
  alamatTinggal            String?
  mulaiBergabungRS         DateTime?
  mulaiBekerjaUnitTerakhir DateTime?
  statusKepegawaian        String?
  asalInstitusiPendidikan  String?
  kelulusanTahun           Int?
  tanggalTerbitSTR         DateTime?
  tanggalBerakhirSTR       String?
  tanggalTerbitSIPP        DateTime?
  jabatanSaatIni           String?
  levelPKSaatIni           String?
  levelPKYangDiajukan      String?
  levelPerawatManajer      String?
  programMutuRCA           Boolean
  setuju                   Boolean
  Akun                     Akun[]
  cpdForPK1                UserCPD_PK1[]
  cpdForPK2                UserCPD_PK2[]
  cpdForPK3                UserCPD_PK3[]
  cpdForPK4                UserCPD_PK4[]
  cpdForPK5                UserCPD_PK5[]
  orientasiYangDiikuti     UserOrientasi[]
  pelatihanYangDiikuti     UserPelatihan[]
}

model Akun {
  iduser                                                                     String                    @id @default(uuid())
  email                                                                      String                    @unique
  password                                                                   String
  last_login                                                                 DateTime?
  nama                                                                       String
  role                                                                       String
  pendidikanTerakhir                                                         PendidikanTerakhir?
  unitTempatBekerjaTerakhir                                                  String?
  userId                                                                     String?
  masterRumahSakitId                                                         String?
  masterRuanganRSId                                                          String?
  created_at                                                                 DateTime                  @default(now())
  MasterRuanganRS                                                            MasterRuanganRS?          @relation("AkunRuanganRS", fields: [masterRuanganRSId], references: [id])
  MasterRumahSakit                                                           MasterRumahSakit?         @relation("AkunRumahSakit", fields: [masterRumahSakitId], references: [id])
  User                                                                       User?                     @relation(fields: [userId], references: [id])
  UserAssesmen                                                               UserAssesmen[]
  UserLogbookKaru                                                            UserLogbookKaru?
  UserPenilaianKaruPerawat                                                   UserPenilaianKaru[]       @relation("akun-perawat")
  UserPenilaianKaru                                                          UserPenilaianKaru[]
  UserRekomendasiKainstal_UserRekomendasiKainstal_email_user_kainstallToAkun UserRekomendasiKainstal[] @relation("UserRekomendasiKainstal_email_user_kainstallToAkun")
  UserRekomendasiKainstal_UserRekomendasiKainstal_email_user_kakomwatToAkun  UserRekomendasiKainstal[] @relation("UserRekomendasiKainstal_email_user_kakomwatToAkun")

  NotifAsKaru    NotificationKaruToPerawat[] @relation("KaruNotifications")
  NotifAsPerawat NotificationKaruToPerawat[] @relation("PerawatNotifications")

  @@index([masterRuanganRSId], map: "Akun_masterRuanganRSId_fkey")
  @@index([masterRumahSakitId], map: "Akun_masterRumahSakitId_fkey")
  @@index([userId], map: "Akun_userId_fkey")
}

model MasterRumahSakit {
  id                      String                    @id @default(uuid())
  nama                    String
  akun                    Akun[]                    @relation("AkunRumahSakit")
  ruanganRS               MasterRuanganRS[]         @relation("RumahSakitToRuanganRS")
  UserRekomendasiKainstal UserRekomendasiKainstal[]
}

model MasterRuanganRS {
  id                      String                    @id @default(uuid())
  nama                    String
  id_rs                   String
  akun                    Akun[]                    @relation("AkunRuanganRS")
  rumahSakit              MasterRumahSakit          @relation("RumahSakitToRuanganRS", fields: [id_rs], references: [id])
  UserRekomendasiKainstal UserRekomendasiKainstal[]

  @@index([id_rs], map: "MasterRuanganRS_id_rs_fkey")
}

model MasterOrientasi {
  id    Int             @id @default(autoincrement())
  value String
  users UserOrientasi[]
}

model MasterPelatihan {
  id    Int             @id @default(autoincrement())
  value String
  users UserPelatihan[]
}

model MasterCPD_PK1 {
  id    Int           @id @default(autoincrement())
  value String
  users UserCPD_PK1[]
}

model MasterCPD_PK2 {
  id    Int           @id @default(autoincrement())
  value String
  users UserCPD_PK2[]
}

model MasterCPD_PK3 {
  id    Int           @id @default(autoincrement())
  value String
  users UserCPD_PK3[]
}

model MasterCPD_PK4 {
  id    Int           @id @default(autoincrement())
  value String
  users UserCPD_PK4[]
}

model MasterCPD_PK5 {
  id    Int           @id @default(autoincrement())
  value String
  users UserCPD_PK5[]
}

model UserOrientasi {
  id          String          @id @default(uuid())
  userId      String
  orientasiId Int
  orientasi   MasterOrientasi @relation(fields: [orientasiId], references: [id])
  user        User            @relation(fields: [userId], references: [id])

  @@unique([userId, orientasiId])
  @@index([orientasiId], map: "UserOrientasi_orientasiId_fkey")
}

model UserPelatihan {
  id          String          @id @default(uuid())
  userId      String
  pelatihanId Int
  pelatihan   MasterPelatihan @relation(fields: [pelatihanId], references: [id])
  user        User            @relation(fields: [userId], references: [id])

  @@unique([userId, pelatihanId])
  @@index([pelatihanId], map: "UserPelatihan_pelatihanId_fkey")
}

model UserCPD_PK1 {
  id     Int           @id @default(autoincrement())
  userId String
  cpdId  Int
  cpd    MasterCPD_PK1 @relation(fields: [cpdId], references: [id])
  user   User          @relation(fields: [userId], references: [id])

  @@unique([userId, cpdId])
  @@index([cpdId], map: "UserCPD_PK1_cpdId_fkey")
}

model UserCPD_PK2 {
  id     Int           @id @default(autoincrement())
  userId String
  cpdId  Int
  cpd    MasterCPD_PK2 @relation(fields: [cpdId], references: [id])
  user   User          @relation(fields: [userId], references: [id])

  @@unique([userId, cpdId])
  @@index([cpdId], map: "UserCPD_PK2_cpdId_fkey")
}

model UserCPD_PK3 {
  id     Int           @id @default(autoincrement())
  userId String
  cpdId  Int
  cpd    MasterCPD_PK3 @relation(fields: [cpdId], references: [id])
  user   User          @relation(fields: [userId], references: [id])

  @@unique([userId, cpdId])
  @@index([cpdId], map: "UserCPD_PK3_cpdId_fkey")
}

model UserCPD_PK4 {
  id     Int           @id @default(autoincrement())
  userId String
  cpdId  Int
  cpd    MasterCPD_PK4 @relation(fields: [cpdId], references: [id])
  user   User          @relation(fields: [userId], references: [id])

  @@unique([userId, cpdId])
  @@index([cpdId], map: "UserCPD_PK4_cpdId_fkey")
}

model UserCPD_PK5 {
  id     Int           @id @default(autoincrement())
  userId String
  cpdId  Int
  cpd    MasterCPD_PK5 @relation(fields: [cpdId], references: [id])
  user   User          @relation(fields: [userId], references: [id])

  @@unique([userId, cpdId])
  @@index([cpdId], map: "UserCPD_PK5_cpdId_fkey")
}

model MasterPertanyaanAssesmen {
  id           Int                  @id @default(autoincrement())
  skp          String?
  sub_kategori String?
  kode         String?
  keterampilan String?
  vokasi       String?
  ners         String?
  tipe         String?
  priority     Int?
  status       Int                  @default(0)
  created_at   DateTime             @default(now())
  updated_at   DateTime             @updatedAt
  jawaban      UserJawabanAsesmen[]
}

model UserAssesmen {
  id                    String               @id @default(uuid())
  tanggal               DateTime             @default(now())
  skp_1                 String?
  skp_2                 String?
  skp_3                 String?
  skp_4                 String?
  skp_5                 String?
  skp_6                 String?
  email                 String
  created_at            DateTime             @default(now())
  updated_at            DateTime             @updatedAt
  id_master_pertanyaans String?              @db.Text
  id_penilaian          String?
  Akun                  Akun                 @relation(fields: [email], references: [email])
  UserPenilaianKaru     UserPenilaianKaru?   @relation(fields: [id_penilaian], references: [id])
  jawaban               UserJawabanAsesmen[]
  UserLogbookKaru       UserLogbookKaru[]

  @@index([email], map: "UserAssesmen_email_fkey")
  @@index([id_penilaian], map: "UserAssesmen_id_penilaian_fkey")
}

model UserJawabanAsesmen {
  id                         Int                      @id @default(autoincrement())
  skor                       Int
  created_at                 DateTime                 @default(now())
  UserAssesmenId             String
  MasterPertanyaanAssesmenId Int
  jawaban                    String
  MasterPertanyaanAssesmen   MasterPertanyaanAssesmen @relation(fields: [MasterPertanyaanAssesmenId], references: [id])
  UserAssesmen               UserAssesmen             @relation(fields: [UserAssesmenId], references: [id])

  @@index([MasterPertanyaanAssesmenId], map: "UserJawabanAsesmen_MasterPertanyaanAssesmenId_fkey")
  @@index([UserAssesmenId], map: "UserJawabanAsesmen_UserAssesmenId_fkey")
}

model MasterLogBookKaru {
  id                     Int                      @id @default(autoincrement())
  skp                    String
  kegiatan               String
  status                 Int                      @default(1)
  created_at             DateTime                 @default(now())
  updated_at             DateTime                 @updatedAt
  UserJawabanLogBookKaru UserJawabanLogBookKaru[]
}

model UserLogbookKaru {
  id               String                   @id @default(uuid())
  email            String                   @unique
  created_at       DateTime                 @default(now())
  updated_at       DateTime                 @default(now()) @updatedAt
  userAsesmenId    String
  idMasterLogBooks String?                  @db.Text
  jawabanLogBook   UserJawabanLogBookKaru[]
  Akun             Akun                     @relation(fields: [email], references: [email])
  UserAssesmen     UserAssesmen             @relation(fields: [userAsesmenId], references: [id])

  @@index([userAsesmenId], map: "UserLogbookKaru_userAsesmenId_fkey")
}

model UserJawabanLogBookKaru {
  id                  String            @id @default(uuid())
  idUserLogBookKaru   String
  idMasterLogBookKaru Int
  jawaban             Int               @default(0)
  created_at          DateTime          @default(now())
  updated_at          DateTime          @default(now()) @updatedAt
  masterLogBookKaru   MasterLogBookKaru @relation(fields: [idMasterLogBookKaru], references: [id])
  userLogbookKaru     UserLogbookKaru   @relation(fields: [idUserLogBookKaru], references: [id])

  @@index([idMasterLogBookKaru], map: "UserJawabanLogBookKaru_idMasterLogBookKaru_fkey")
  @@index([idUserLogBookKaru], map: "UserJawabanLogBookKaru_idUserLogBookKaru_fkey")
}

model MasterPenilaianKaru {
  id                       Int                        @id @default(autoincrement())
  kategori                 String
  penilaian                String
  status                   Int                        @default(1)
  created_at               DateTime                   @default(now())
  updated_at               DateTime                   @default(now()) @updatedAt
  UserJawabanPenilaianKaru UserJawabanPenilaianKaru[]
}

model UserPenilaianKaru {
  id                        String                     @id @default(uuid())
  email                     String
  score                     Float                      @default(0)
  idMasterPenilaianKaru     String                     @db.Text
  created_at                DateTime                   @default(now())
  updated_at                DateTime                   @default(now()) @updatedAt
  email_perawat             String?                    @db.VarChar(100)
  tanggal                   String?                    @db.VarChar(100)
  userRekomendasiKainstalId BigInt?
  UserAssesmen              UserAssesmen[]
  UserJawabanPenilaianKaru  UserJawabanPenilaianKaru[]
  AkunPerawat               Akun?                      @relation("akun-perawat", fields: [email_perawat], references: [email], onDelete: Restrict, onUpdate: Restrict, map: "UserPenilaianKaru_Akun_FK")
  Akun                      Akun                       @relation(fields: [email], references: [email])
  UserRekomendasiKainstal   UserRekomendasiKainstal[]

  @@index([email], map: "UserPenilaianKaru_email_fkey")
  @@index([email_perawat], map: "UserPenilaianKaru_Akun_FK")
}

model UserJawabanPenilaianKaru {
  id                    Int                 @id @default(autoincrement())
  idUserPenilaianKaru   String
  idMasterPenilaianKaru Int
  Skor                  Int?
  MasterPenilaianKaru   MasterPenilaianKaru @relation(fields: [idMasterPenilaianKaru], references: [id])
  UserPenilaianKaru     UserPenilaianKaru   @relation(fields: [idUserPenilaianKaru], references: [id])

  @@index([idMasterPenilaianKaru], map: "UserJawabanPenilaianKaru_idMasterPenilaianKaru_fkey")
  @@index([idUserPenilaianKaru], map: "UserJawabanPenilaianKaru_idUserPenilaianKaru_fkey")
}

model UserRekomendasiKainstal {
  id                                                      BigInt             @id @default(autoincrement())
  id_user_penilaian_karu                                  String?
  idMasterRumahSakit                                      String?
  idMasterRuanganRS                                       String?
  total_scrore_skp1                                       Float?             @db.Float
  total_scrore_skp2                                       Float?             @db.Float
  total_scrore_skp3                                       Float?             @db.Float
  total_scrore_skp4                                       Float?             @db.Float
  total_scrore_skp5                                       Float?             @db.Float
  total_scrore_skp6                                       Float?             @db.Float
  email_user_kainstall                                    String?            @db.VarChar(50)
  feedback_to_karu                                        String?            @db.VarChar(100)
  email_user_kakomwat                                     String?            @db.VarChar(50)
  submited_at                                             DateTime?          @db.DateTime(0)
  approved_at                                             DateTime?          @db.DateTime(0)
  status_approval                                         String
  Akun_UserRekomendasiKainstal_email_user_kainstallToAkun Akun?              @relation("UserRekomendasiKainstal_email_user_kainstallToAkun", fields: [email_user_kainstall], references: [email], onDelete: Restrict, onUpdate: Restrict, map: "UserRekomendasiKainstal_Akun_FK")
  Akun_UserRekomendasiKainstal_email_user_kakomwatToAkun  Akun?              @relation("UserRekomendasiKainstal_email_user_kakomwatToAkun", fields: [email_user_kakomwat], references: [email], onDelete: Restrict, onUpdate: Restrict, map: "UserRekomendasiKainstal_Akun_FK_1")
  MasterRuanganRS                                         MasterRuanganRS?   @relation(fields: [idMasterRuanganRS], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "UserRekomendasiKainstal_MasterRuanganRS_FK")
  MasterRumahSakit                                        MasterRumahSakit?  @relation(fields: [idMasterRumahSakit], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "UserRekomendasiKainstal_MasterRumahSakit_FK")
  UserPenilaianKaru                                       UserPenilaianKaru? @relation(fields: [id_user_penilaian_karu], references: [id], onDelete: Restrict, onUpdate: Restrict, map: "UserRekomendasiKainstal_UserPenilaianKaru_FK")

  @@index([email_user_kainstall], map: "UserRekomendasiKainstal_Akun_FK")
  @@index([email_user_kakomwat], map: "UserRekomendasiKainstal_Akun_FK_1")
  @@index([idMasterRuanganRS], map: "UserRekomendasiKainstal_MasterRuanganRS_FK")
  @@index([idMasterRumahSakit], map: "UserRekomendasiKainstal_MasterRumahSakit_FK")
  @@index([id_user_penilaian_karu], map: "UserRekomendasiKainstal_UserPenilaianKaru_FK")
}

// Existing models...

model NotificationKaruToPerawat {
  id              String   @id @default(uuid())
  fromKaruEmail   String
  toPerawatEmail  String
  message         String
  isRead          Boolean  @default(false)
  selfAsesmenDate DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  fromKaru  Akun @relation("KaruNotifications", fields: [fromKaruEmail], references: [email])
  toPerawat Akun @relation("PerawatNotifications", fields: [toPerawatEmail], references: [email])

  akunIduser String?

  @@index([fromKaruEmail])
  @@index([toPerawatEmail])
}

// Other existing models...

enum PendidikanTerakhir {
  VOKASI
  NERS
  S2_KEP
}



type/request.ts
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


type/response.ts
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
    masterRuanganRSId: unknown
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

export type MasterLogBookKaruResponse = {
    id: number;
    skp: string;
    kegiatan: string;
    status: number;
    created_at: Date;
    updated_at: Date;
};

export type MasterLogBookKaruActiveResponse = Omit<MasterLogBookKaruResponse, 'status'>;

export type MasterPenilaianKaruResponse = {
    id: number;
    kategori: string;
    penilaian: string;
    status: number;
    created_at: Date;
    updated_at: Date;
};

export type MasterPenilaianKaruActiveResponse = Omit<MasterPenilaianKaruResponse, 'status'>;

export interface UserLogbookKaruResponse {
    id: string;
    id_master_logbook_karus: string[];
    answers: { id: number, jawaban: number }[];
}


