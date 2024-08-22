/* eslint-disable */
import { PendidikanTerakhir, PrismaClient } from '@prisma/client';
import * as XLSX from "xlsx"
import bcrypt from "bcrypt"


const prisma = new PrismaClient();

function hashPassword(password: string): string {
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    return hashedPassword;
}

function makeUrlSafeRole(role: string) {
    return role.toLowerCase().replace(/\s+/g, '_');
}

function makeUrlSafePendidkan(p: string) {
    if (p == undefined) return null
    return p.toUpperCase().replace(/\s+/g, '_') as PendidikanTerakhir
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
                kode: `${kode}`,
                keterampilan,
                vokasi: `${vokasi}`,
                ners: `${ners}`,
                priority,
                tipe,
                status: 1
            } as never
        })
    })
    console.log(masterpertanyaan)

    const workbookmaster = XLSX.readFile('seed-db.xlsx');
    // const sheetNames = workbook.SheetNames;
    const jsonData: any[] = XLSX.utils.sheet_to_json(workbookmaster.Sheets["akun"]);
    // insert master data and akun

    // Step 1: Identifikasi unik Rumah Sakit dan Ruangan
    const rumahSakitSet = new Set();
    const ruanganRSMap = new Map();

    for (const record of jsonData) {
        if (record.RS) {
            rumahSakitSet.add(record.RS);
        }

        if (record.Runagan) {
            if (!ruanganRSMap.has(record.RS)) {
                ruanganRSMap.set(record.RS, new Set());
            }
            ruanganRSMap.get(record.RS).add(record.Runagan);
        }
    }

    // Step 2: Masukkan data Rumah Sakit
    const rumahSakitMap = new Map();

    for (const rs of rumahSakitSet) {
        const rumahSakit = await prisma.masterRumahSakit.create({
            data: {
                nama: `${rs}`,
            }
        });
        rumahSakitMap.set(rs, rumahSakit.id);
    }

    // Step 3: Masukkan data Ruangan RS
    const ruanganRSMapFinal = new Map();

    for (const [rs, ruanganSet] of ruanganRSMap.entries()) {
        const idRS = rumahSakitMap.get(rs);
        for (const ruangan of ruanganSet) {
            const ruanganRS = await prisma.masterRuanganRS.create({
                data: {
                    nama: ruangan,
                    rumahSakit: {
                        connect: { id: idRS }
                    }
                }
            });
            ruanganRSMapFinal.set(`${rs}-${ruangan}`, ruanganRS.id);
        }
    }

    // Step 4: Persiapkan data untuk createMany Akun
    const akunData = jsonData.map(record => {
        const rumahSakitId = record.RS ? rumahSakitMap.get(record.RS) : null;
        const ruanganRSId = record.Runagan ? ruanganRSMapFinal.get(`${record.RS}-${record.Runagan}`) : null;

        return {
            email: record.Email,
            password: hashPassword(record.Password),
            nama: record.Nama,
            role: makeUrlSafeRole(record.Role),  // Gunakan fungsi makeUrlSafeRole
            masterRumahSakitId: rumahSakitId,
            masterRuanganRSId: ruanganRSId,
            pendidikanTerakhir: makeUrlSafePendidkan(record?.Pendidikan)
        };
    });

    // Step 5: Masukkan data Akun secara massal dengan createMany
    await prisma.akun.createMany({
        data: akunData,
        skipDuplicates: true, // Mengabaikan duplikasi berdasarkan kunci unik seperti email
    });

    // Persiapkan data untuk createMany
    const jsonDataOrientasi: any[] = XLSX.utils.sheet_to_json(workbookmaster.Sheets["orientasi"]);
    const orientasiData = jsonDataOrientasi.map(record => ({
        value: record.Nama
    }));

    // Masukkan data orientasi secara massal dengan createMany
    await prisma.masterOrientasi.createMany({
        data: orientasiData,
        skipDuplicates: true, // Mengabaikan duplikasi jika ada
    });

    const jsonDataPelatihan: any[] = XLSX.utils.sheet_to_json(workbookmaster.Sheets["orientasi"]);
    const pelatihanData = jsonDataPelatihan.map(record => ({
        value: record.Nama
    }));

    // Masukkan data orientasi secara massal dengan createMany
    await prisma.masterPelatihan.createMany({
        data: pelatihanData,
        skipDuplicates: true, // Mengabaikan duplikasi jika ada
    });


    const jsonDataCPD: any[] = XLSX.utils.sheet_to_json(workbookmaster.Sheets["cpd"]);
    // Loop melalui data dan masukkan ke tabel yang sesuai
    for (const record of jsonDataCPD) {
        if (record.pk === 'pk1') {
            await prisma.masterCPD_PK1.create({
                data: {
                    value: record.Keterampilan,
                },
            });
        } else if (record.pk === 'pk2') {
            await prisma.masterCPD_PK2.create({
                data: {
                    value: record.Keterampilan,
                },
            });
        } else if (record.pk === 'pk3') {
            await prisma.masterCPD_PK3.create({
                data: {
                    value: record.Keterampilan,
                },
            });
        } else if (record.pk === 'pk4') {
            await prisma.masterCPD_PK4.create({
                data: {
                    value: record.Keterampilan,
                },
            });
        } else if (record.pk === 'pk5') {
            await prisma.masterCPD_PK5.create({
                data: {
                    value: record.Keterampilan,
                },
            });
        } else {
            console.error(`Invalid pk: ${record.pk}`);
        }
    }

    await prisma.akun.update({
        data: { masterRumahSakitId: null, masterRuanganRSId: null },
        where: {
            email: "admin@gmail.com"
        }
    })

    await prisma.masterRuanganRS.deleteMany({
        where: {
            nama: {
                contains: "null"
            }
        }
    })
    await prisma.masterRumahSakit.deleteMany({
        where: {
            nama: {
                contains: "null"
            }
        }
    })

    await prisma.masterLogBookKaru.createMany({
        data: [
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0001, D0003, D0005 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0007 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0018, D0021, D0026, D0027, D0028 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0041, D0048 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0055 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0061, D0064, D0065, D0066, sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0076, sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0081, D0082, D0083, D0087, D0088, D0092 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0106, sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0109, D0116 sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0111, sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0121, sesuai kewenangannya.' },
            { skp: 'SKP1', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0130, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0001, D0003, D0005 sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0018, D0024, D0027, D0028, D0029, D0030, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0040, D0041, D0042, D0043, D0049, D0050, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0054, D0056, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0061, D0062, D0064, D0065, D0066, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0076, D0077, D0078, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0080, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0109, D0111, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0106, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0121, sesuai kewenangannya.' },
            { skp: 'SKP2', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0129, sesuai kewenangannya.' },
            { skp: 'SKP3', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0001, D0005, sesuai kewenangannya.' },
            { skp: 'SKP3', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0007, D0008, D0009, sesuai kewenangannya.' },
            { skp: 'SKP3', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0019, D0020, D0021, D0022, D0027, sesuai kewenangannya.' },
            { skp: 'SKP3', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0049, D0050 sesuai kewenangannya.' },
            { skp: 'SKP3', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0061, sesuai kewenangannya.' },
            { skp: 'SKP3', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0130, sesuai kewenangannya.' },
            { skp: 'SKP4', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0009 sesuai kewenangannya.' },
            { skp: 'SKP5', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0007, D0008, D0009, sesuai kewenangannya.' },
            { skp: 'SKP5', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0020 sesuai kewenangannya.' },
            { skp: 'SKP5', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0056, D0064, sesuai kewenangannya.' },
            { skp: 'SKP5', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0081, D0082, D0083 sesuai kewenangannya.' },
            { skp: 'SKP5', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0106 sesuai kewenangannya.' },
            { skp: 'SKP5', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0129, D0133, sesuai kewenangannya.' },
            { skp: 'SKP6', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0057, D0066 sesuai kewenangannya.' },
            { skp: 'SKP6', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0092 sesuai kewenangannya.' },
            { skp: 'SKP6', kegiatan: 'Perawat melakukan identifikasi pada pelaksanaan askep pasien dengan D0133, D0143 sesuai kewenangannya.' },
        ],
    });

    await prisma.masterPenilaianKaru.createMany({
        data: [
            { kategori: 'Komunikasi', penilaian: 'Selalu berkomunikasi dalam menjalankan tugas KP dengan baik kepada atasan (Karu,Ka instal dan Ka komwat)' },
            { kategori: 'Komunikasi', penilaian: 'Selalu berkomunikasi dalam menjalankan tugas KP dengan baik kepada teman sejawat' },
            { kategori: 'Komunikasi', penilaian: 'Selalu berkomunikasi dalam menjalankan tugas KP dengan baik kepada tim kesehatan lainnya' },
            { kategori: 'Komunikasi', penilaian: 'Selalu berkomunikasi dalam menjalankan tugas KP dengan baik kepada pasien dan keluarganya' },
            { kategori: 'Pemahaman keselamatan pasien', penilaian: 'Memahami Definisi Keselamatan Pasien' },
            { kategori: 'Pemahaman keselamatan pasien', penilaian: 'Memahami manfaat dari Keselamatan Pasien' },
            { kategori: 'Pemahaman keselamatan pasien', penilaian: 'Memahami Insiden Keselamatan Pasien' },
            { kategori: 'Pemahaman keselamatan pasien', penilaian: 'Memahami 6 Strategi menjaga Keselamatan Pasien' },
            { kategori: 'Kehandalan', penilaian: 'Menjaga KP selama menjalankan tugasnya' },
            { kategori: 'Kehandalan', penilaian: 'Melaksanakan 6 SKP selama menjalankan tugas sebagai perawat' },
            { kategori: 'Kehandalan', penilaian: 'Menunjukkan kesadaran tentang pentingnya KP' },
            { kategori: 'Kehandalan', penilaian: 'Mempunyai motivasi tinggi untuk menjaga KP' },
            { kategori: 'Kehandalan', penilaian: 'Melakukan pelaporan insiden dengan kesadaran tinggi untuk menjaga KP' },
            { kategori: 'Kehandalan', penilaian: 'Selalu mengevaluasi diri dalam menjaga KP' },
            { kategori: 'Kehandalan', penilaian: 'Mengupdate ilpeng & pemahamannya untuk menjaga KP' },
            { kategori: 'Kehandalan', penilaian: 'Melakukan komunikasi yang efektif dengan teman sejawat, dengan klien & tim kesehatan lainnya dalam menjalankan tugas sehari-hari' },
            { kategori: 'Kepatuhan', penilaian: 'Kepatuhan melaksanakan SOP SKP 1 (Ketepatan Identifikasi Pasien)' },
            { kategori: 'Kepatuhan', penilaian: 'Kepatuhan Melaksanakan SOP SKP 2 (komunikasi efektif)' },
            { kategori: 'Kepatuhan', penilaian: 'Kepatuhan Melaksanakan SOP SKP 3 (pengelolaan Obat yang perlu diwaspadai)' },
            { kategori: 'Kepatuhan', penilaian: 'Kepatuhan Melaksanakan SOP SKP 4 (Ketepatan Lokasi, prosedur dan pasien operasi)' },
            { kategori: 'Kepatuhan', penilaian: 'Kepatuhan Melaksanakan SOP SKP 5 (Mengurangi resiko Infeksi)' },
            { kategori: 'Kepatuhan', penilaian: 'Kepatuhan Melaksanakan SOP SKP 6 (Mengurangi resiko jatuh)' },
            { kategori: 'Kerja Sama', penilaian: 'Mampu menyelesaikan permasalahan keselamatan pasien sesuai perannya di dalam tim' },
            { kategori: 'Kerja Sama', penilaian: 'Melakukan Komunikasi efektif dengan teman sejawat/atasan dalam menyelesaikan KP di dalam tim' },
            { kategori: 'Kepemimpinan', penilaian: 'Bertanggung jawab dalam menjaga KP' },
            { kategori: 'Kepemimpinan', penilaian: 'Melakukan budaya kerja positif dalam menjaga KP' },
        ],
    });
    // console.log(akun)

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
