import { JwtPayload } from "app-type/index"
import { UpdateUserRequest, UserByEmailRequest, UserResetPassRequest } from "app-type/request"
import { FastifyPluginAsync } from "fastify"

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { hashPassword } = fastify

    fastify.get('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        const d = await request.jwtDecode() as JwtPayload
        const user = await fastify.prisma.akun.findFirst({
            select: {
                email: true,
                iduser: true,
                role: true,
                last_login: true,
                pendidikanTerakhir: true,
                unitTempatBekerjaTerakhir: true,
                MasterRuanganRS: true,
                masterRumahSakitId: true,
                created_at: true,
                nama: true
            },
            // include: { MasterRuanganRS: true, MasterRumahSakit: true, User: true },
            where: {
                email: d.email
            }
        })
        return user
    })

    fastify.get('/by-email', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        const { email } = request.params as UserByEmailRequest
        // const d = await request.jwtDecode() as JwtPayload
        const akun = await fastify.prisma.akun.findFirst({
            select: {
                email: true,
                iduser: true,
                role: true,
                last_login: true,
                pendidikanTerakhir: true,
                unitTempatBekerjaTerakhir: true,
                MasterRuanganRS: true,
                masterRumahSakitId: true,
                created_at: true,
            },
            // include: { MasterRuanganRS: true, MasterRumahSakit: true, User: true },
            where: {
                email: email
            }
        })
        return akun
    })

    fastify.get('/reset-pass', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        const { email, password } = request.params as UserResetPassRequest
        // const d = await request.jwtDecode() as JwtPayload
        const akun = await fastify.prisma.akun.update({
            data: {
                password: hashPassword(password),
            },
            where: {
                email: email
            }
        })
        if (akun.email) {
            return "sukses"
        } else {
            return "gagal"
        }
    })

    fastify.get('/search', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        const { email } = request.params as UserByEmailRequest
        // const d = await request.jwtDecode() as JwtPayload
        const akun = await fastify.prisma.akun.findMany({
            select: {
                email: true,
                iduser: true,
                role: true,
                last_login: true,
                pendidikanTerakhir: true,
                unitTempatBekerjaTerakhir: true,
                MasterRuanganRS: true,
                masterRumahSakitId: true,
                created_at: true,
            },
            // include: { MasterRuanganRS: true, MasterRumahSakit: true, User: true },
            where: {
                email: email
            }
        })
        return akun
    })

    fastify.post("/update/by-email", { onRequest: [fastify.authenticate] }, async function (request, reply) {
        const { email, akun, user } = request.params as UpdateUserRequest
        // const d = await request.jwtDecode() as JwtPayload
        const akunUpdate = await fastify.prisma.akun.update({
            data: {
                // email: akun.email,
                // iduser: akun,
                role: akun.role,
                // last_login: ,
                pendidikanTerakhir: akun.pendidikanTerakhir,
                unitTempatBekerjaTerakhir: akun.unitTempatBekerjaTerakhir,
            },
            // include: { MasterRuanganRS: true, MasterRumahSakit: true, User: true },
            where: {
                email: email
            }
        })
        if (akunUpdate.iduser) {
            await fastify.prisma.user.update({
                data: {
                    jenisKelamin: user?.jenisKelamin,
                    alamatDomisili: user?.alamatDomisili,
                    alamatTinggal: user?.alamatTinggal,
                    mulaiBergabungRS: user?.mulaiBergabungRS,
                    statusKepegawaian: user?.statusKepegawaian,
                    asalInstitusiPendidikan: user?.asalInstitusiPendidikan,
                    kelulusanTahun: user?.kelulusanTahun,
                    tanggalBerakhirSTR: user?.tanggalBerakhirSTR,
                    tanggalTerbitSTR: user?.tanggalTerbitSTR,
                    tanggalTerbitSIPP: user?.tanggalTerbitSIPP,
                    jabatanSaatIni: user?.jabatanSaatIni,
                    levelPKSaatIni: user?.levelPKSaatIni,
                    levelPKYangDiajukan: user?.levelPKYangDiajukan,
                    levelPerawatManajer: user?.levelPerawatManajer,
                    programMutuRCA: user?.programMutuRCA,
                    setuju: user?.setuju
                },
                where: {
                    id: akunUpdate.iduser
                }
            })
        } else {
            const createUser = await fastify.prisma.user.create({
                data: {
                    jenisKelamin: user?.jenisKelamin,
                    alamatDomisili: user?.alamatDomisili,
                    alamatTinggal: user?.alamatTinggal,
                    mulaiBergabungRS: user?.mulaiBergabungRS,
                    statusKepegawaian: user?.statusKepegawaian,
                    asalInstitusiPendidikan: user?.asalInstitusiPendidikan,
                    kelulusanTahun: user?.kelulusanTahun,
                    tanggalBerakhirSTR: user?.tanggalBerakhirSTR,
                    tanggalTerbitSTR: user?.tanggalTerbitSTR,
                    tanggalTerbitSIPP: user?.tanggalTerbitSIPP,
                    jabatanSaatIni: user?.jabatanSaatIni,
                    levelPKSaatIni: user?.levelPKSaatIni,
                    levelPKYangDiajukan: user?.levelPKYangDiajukan,
                    levelPerawatManajer: user?.levelPerawatManajer,
                    programMutuRCA: user?.programMutuRCA || false,
                    setuju: user?.setuju || false
                },
            })
            if (createUser.id) {
                await fastify.prisma.akun.update({
                    data: { iduser: createUser.id },
                    where: { email: email }
                })
                akunUpdate.iduser = createUser.id
            }
        }
        if (akunUpdate.iduser) {
            // cek untuk cpd, orientasi dan pelatihan
        }
        return akun
    })
}

export default user;
