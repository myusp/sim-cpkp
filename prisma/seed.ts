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
