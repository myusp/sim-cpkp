import { PrismaClient } from '@prisma/client';
import * as XLSX from "xlsx"
import bcrypt from "bcrypt"


const prisma = new PrismaClient();

function hashPassword(password: string): string {
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}

// Fungsi untuk verifikasi password
function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
    const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
    return isMatch;
}

async function main() {
    console.log("seed start")
    const workbook = XLSX.readFile('diagnosa_x_intervensi.xlsx');

    // Pilih sheet
    const sheetName = "copy_db"; // Mengambil sheet pertama
    const worksheet = workbook.Sheets[sheetName];

    // Konversi sheet menjadi array JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // console.log(data.slice(1))
    // const now = dayjs()
    const masterpertanyaan = await prisma.masterPertanyaanAssesmen.createMany({
        data: data.slice(1).map((d) => {
            const [skp, sub_kategori, kode, keterampilan, vokasi, ners, tipe, priority] = d as unknown[]
            return {
                skp: skp as string,
                sub_kategori,
                kode,
                keterampilan,
                vokasi,
                ners,
                priority,
                tipe,
                status: 1
            } as never
        })
    })
    console.log(masterpertanyaan)


    const pwd = hashPassword("password")
    // Create User
    const akun = await prisma.akun.create({
        data: {
            email: "admin@gmail.com",
            nama: "admin aplikasi",
            password: pwd,
            role: "admin",

        }
    });
    console.log(akun)

    // Master data creation for Orientasi and Pelatihan
    const orientasi = await prisma.masterOrientasi.createMany({
        data: [
            { value: 'Pelatihan Sasaran Keselamatan Pasien (SKP)' },
            { value: 'Pelatihan Pencegahan dan Pengendalian Infeksi (PPI)' },
            { value: 'Pelatihan Komunikasi Efektif' },
            { value: 'Pelatihan Keselamatan Kerja Karyawan dan Lingkungan (K3L)' },
            { value: 'Bantuan Hidup Dasar (BHD)' },
            { value: 'Pelatihan Komunikasi efektif' },
            { value: 'Pelatihan Dokumentasi menggunakan AFYA' },
        ]
    });
    console.log(orientasi)

    const pelatihan = await prisma.masterPelatihan.createMany({
        data: [
            { value: 'Basic Cardiac and Trauma Life Support (BTCLS)' },
            { value: 'Advanced Cardiac Life Support (ACLS)/Bantuan Hidup Lanjut (BLS)' },
            { value: 'Pelatihan Keterampilan ICU Dasar' },
            { value: 'Pelatihan Keterampilan ICU Lanjut' },
            { value: 'Pelatihan Keterampilan NICU Level 2/Level 3' },
            { value: 'Pelatihan Keterampilan PICU' },
            { value: 'Pelatihan Perawatan Luka' },
            { value: 'Pelatihan Keterampilan Kamar Bedah' },
            { value: 'Pelatihan Keterampilan IGD Dasar' },
        ]
    });
    console.log(pelatihan)

    // Master data creation for CPD per PK Level
    const masterCPD_PK1 = await prisma.masterCPD_PK1.createMany({
        data: [
            { value: 'Basic Life Support (BLS)' },
            { value: 'Pengkajian Dasar' },
            { value: 'Prosedur Perawatan Dasar' },
            { value: 'Pelayanan Kesehatan Dasar' },
            { value: 'Asuhan Keperawatan Keluarga' },
            { value: 'Triage Keperawatan' },
        ]
    });
    console.log(masterCPD_PK1)

    const masterCPD_PK2 = await prisma.masterCPD_PK2.createMany({
        data: [
            { value: 'Asuhan Keperawatan Medikal Bedah' },
            { value: 'Keperawatan Gawat Darurat Dasar' },
            { value: 'Pengkajian Keperawatan Lanjut' },
            { value: 'Penggunaan Alat Kesehatan Dasar' },
            { value: 'Keperawatan Penyakit Tidak Menular' },
            { value: 'Asuhan Keperawatan Lansia' },
        ]
    });
    console.log(masterCPD_PK2)

    const masterCPD_PK3 = await prisma.masterCPD_PK3.createMany({
        data: [
            { value: 'Keperawatan Bencana Dasar' },
            { value: 'Keperawatan Bencana Lanjut' },
            { value: 'Manajemen Bencana' },
            { value: 'Keperawatan Kritis Lanjut' },
            { value: 'Audit Asuhan Keperawatan' },
            { value: 'Asuhan Keperawatan Kardiovaskular' },
        ]
    });
    console.log(masterCPD_PK3)

    const masterCPD_PK4 = await prisma.masterCPD_PK4.createMany({
        data: [
            { value: 'Asuhan Keperawatan Spesialistik' },
            { value: 'Keperawatan Gawat Darurat Lanjut' },
            { value: 'Keperawatan Kritis Lanjut' },
            { value: 'Asuhan Keperawatan Anak' },
            { value: 'Asuhan Keperawatan Obstetri' },
            { value: 'Asuhan Keperawatan Neurologi' },
        ]
    });
    console.log(masterCPD_PK4)

    const masterCPD_PK5 = await prisma.masterCPD_PK5.createMany({
        data: [
            { value: 'Asuhan Keperawatan Sub Spesialis' },
            { value: 'Keterampilan Klinis Sub Spesialis' },
            { value: 'Manajemen Asuhan Keperawatan di RS' },
            { value: 'Manajemen Strategi Asuhan Keperawatan' },
            { value: 'Manajemen Konseling' },
            { value: 'Metodologi Pendidikan Kesehatan Sasaran Masyarakat Kompleks' },
            { value: 'Metodologi Riset Lanjut' },
        ]
    });
    console.log(masterCPD_PK5)



    console.log('Data has been seeded');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
