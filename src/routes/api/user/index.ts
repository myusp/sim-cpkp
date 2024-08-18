import { PendidikanTerakhir } from "@prisma/client"
import { Akun, JwtPayload, User } from "app-type/index"
import { CreateUserRequest, UpdateUserRequest, UserByEmailRequest, UserResetPassRequest, UserSearchRequest } from "app-type/request"
import { UserResponse, ErrorResponse, UpdateUserResponse, UserResetPassResponse, UserSearchResponse } from "app-type/response"
import dayjs from "dayjs"
import { FastifyPluginAsync } from "fastify"

const user: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { hashPassword, prisma } = fastify

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
                MasterRumahSakit: true,
                masterRuanganRSId: true,
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

    fastify.get('/by-email', {}, async function (request, reply) {
        const { email } = request.query as UserByEmailRequest
        // const d = await request.jwtDecode() as JwtPayload
        const akun = await fastify.prisma.akun.findFirst({
            select: {
                email: true,
                iduser: true,
                role: true,
                last_login: true,
                pendidikanTerakhir: true,
                unitTempatBekerjaTerakhir: true,
                masterRuanganRSId: true,
                MasterRuanganRS: true,
                masterRumahSakitId: true,
                MasterRumahSakit: true,
                created_at: true,
                User: {
                    include: {
                        cpdForPK1: true,
                        cpdForPK2: true,
                        cpdForPK3: true,
                        cpdForPK4: true,
                        cpdForPK5: true,
                        orientasiYangDiikuti: true,
                        pelatihanYangDiikuti: true,
                    }
                }
            },
            // include: { MasterRuanganRS: true, MasterRumahSakit: true, User: true },
            where: {
                email: email
            }
        })
        return akun
    })

    fastify.post<{ Body: CreateUserRequest, Reply: UserResponse | ErrorResponse }>('/create',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            try {
                const data = request.body
                const hashedPassword = hashPassword(data.password)
                const newUser = await fastify.prisma.akun.create({
                    data: {
                        email: data.email,
                        password: hashedPassword,  // Menggunakan password yang sudah di-hash
                        nama: data.nama,
                        role: data.role,
                        pendidikanTerakhir: data.pendidikanTerakhir as PendidikanTerakhir,
                        unitTempatBekerjaTerakhir: data.unitTempatBekerjaTerakhir,
                        userId: data.userId,
                        masterRumahSakitId: data.masterRumahSakitId,
                        masterRuanganRSId: data.masterRuanganRSId,
                    },
                });


                reply.status(200).send({
                    email: newUser.email,
                    created_at: newUser.created_at,
                    iduser: newUser.iduser,
                    nama: newUser.nama,
                    role: newUser.role,
                    masterRuanganRSId: `${newUser.masterRuanganRSId}`,
                    masterRumahSakitId: `${newUser.masterRumahSakitId}`,
                    pendidikanTerakhir: `${newUser.masterRumahSakitId}`,
                    unitTempatBekerjaTerakhir: `${newUser.unitTempatBekerjaTerakhir}`
                });
            } catch (error) {
                reply.status(500).send({ error: 'Failed to create user' });
            }
        });

    fastify.put<{ Body: UpdateUserRequest, Reply: UpdateUserResponse | ErrorResponse }>('/update',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            try {
                const data = request.body
                const d = await prisma.$transaction(async (tx) => {
                    // Update data di tabel Akun jika diberikan
                    const updatedAkun = data.akun
                        ? await tx.akun.update({
                            where: { email: data.email },
                            data: {
                                nama: data.akun.nama,
                                masterRuanganRSId: data.akun.masterRuanganRSId,
                                masterRumahSakitId: data.akun.masterRumahSakitId,
                                pendidikanTerakhir: data.akun.pendidikanTerakhir as PendidikanTerakhir,
                                unitTempatBekerjaTerakhir: data.akun.unitTempatBekerjaTerakhir,
                            },
                        })
                        : await tx.akun.findFirst({ where: { email: data.email } });

                    // console.log("updatedAkun", updatedAkun)
                    // Update data di tabel User jika diberikan
                    let updatedUser = data.user
                        ? await tx.user.upsert({
                            where: { id: updatedAkun?.iduser! },
                            create: {
                                ...data.user,
                                setuju: data.user.setuju || true,
                                kelulusanTahun: dayjs(data.user.kelulusanTahun).year() || null
                            },
                            update: {
                                ...data.user,
                                setuju: data.user.setuju || true,
                                kelulusanTahun: dayjs(data.user.kelulusanTahun).year() || null
                            }
                        })
                        : await tx.user.findUnique({ where: { id: updatedAkun?.iduser! } });

                    console.log("updatedUser", updatedUser)
                    // Siapkan response
                    const response: UpdateUserResponse = {
                        email: updatedAkun?.email!,
                        akun: updatedAkun! as Akun,
                        user: updatedUser! as User,
                        cpd_pk1: data.cpd_pk1 || [],
                        cpd_pk2: data.cpd_pk2 || [],
                        cpd_pk3: data.cpd_pk3 || [],
                        cpd_pk4: data.cpd_pk4 || [],
                        cpd_pk5: data.cpd_pk5 || [],
                        orientasi: data.orientasi || [],
                        pelatihan: data.pelatihan || [],
                    };

                    return response;
                });

                if (d.user) {
                    await prisma.akun.update({ where: { email: data.email }, data: { userId: d.user.id } })
                }
                // Update pelatihan (UserPelatihan) jika diberikan
                if (data.pelatihan) {
                    await prisma.userPelatihan.deleteMany({ where: { userId: d.user?.id } });
                    for (const pelatihanId of data.pelatihan) {
                        await prisma.userPelatihan.create({
                            data: { userId: d.user?.id!, pelatihanId },
                        });
                    }
                }

                // Update orientasi (UserOrientasi) jika diberikan
                if (data.orientasi) {
                    await prisma.userOrientasi.deleteMany({ where: { userId: d.user?.id! } });
                    for (const orientasiId of data.orientasi) {
                        await prisma.userOrientasi.create({
                            data: { userId: d.user?.id!, orientasiId },
                        });
                    }
                }

                // Update CPD_PK1 hingga CPD_PK5 jika diberikan
                if (data.cpd_pk1) {
                    await prisma.userCPD_PK1.deleteMany({ where: { userId: d.user?.id! } });
                    for (const cpdId of data.cpd_pk1) {
                        await prisma.userCPD_PK1.create({
                            data: { userId: d.user?.id!, cpdId },
                        });
                    }
                }

                if (data.cpd_pk2) {
                    await prisma.userCPD_PK2.deleteMany({ where: { userId: d.user?.id! } });
                    for (const cpdId of data.cpd_pk2) {
                        await prisma.userCPD_PK2.create({
                            data: { userId: d.user?.id!, cpdId },
                        });
                    }
                }

                if (data.cpd_pk3) {
                    await prisma.userCPD_PK3.deleteMany({ where: { userId: d.user?.id! } });
                    for (const cpdId of data.cpd_pk3) {
                        await prisma.userCPD_PK3.create({
                            data: { userId: d.user?.id!, cpdId },
                        });
                    }
                }

                if (data.cpd_pk4) {
                    await prisma.userCPD_PK4.deleteMany({ where: { userId: d.user?.id! } });
                    for (const cpdId of data.cpd_pk4) {
                        await prisma.userCPD_PK4.create({
                            data: { userId: d.user?.id!, cpdId },
                        });
                    }
                }

                if (data.cpd_pk5) {
                    await prisma.userCPD_PK5.deleteMany({ where: { userId: d.user?.id! } });
                    for (const cpdId of data.cpd_pk5) {
                        await prisma.userCPD_PK5.create({
                            data: { userId: d.user?.id!, cpdId },
                        });
                    }
                }

                reply.send(d);
            } catch (error) {
                console.log(error)
                reply.status(500).send({ error: "failed to create user" });
            }
        });

    fastify.put<{ Body: UserResetPassRequest, Reply: UserResetPassResponse | ErrorResponse }>('/reset-password',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            try {
                const data = request.body
                const user = await prisma.akun.findUnique({
                    where: { email: data.email },
                });

                if (!user) {
                    throw new Error('User not found');
                }

                // Hash password baru
                const hashedPassword = hashPassword(data.newPassword);

                // Update password di database
                await prisma.akun.update({
                    where: { email: data.email },
                    data: { password: hashedPassword },
                });
                reply.send({
                    message: "Berhasil mengupdate password"
                });
            } catch (error) {
                reply.status(500).send({ error: "gagal update password" });
            }
        });

    fastify.get<{ Querystring: UserSearchRequest, Reply: UserSearchResponse | ErrorResponse }>('/search',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            try {
                const filters = request.query
                const queryConditions: any = {};

                if (filters.keyword || filters.rumahSakitId || filters.ruanganId || filters.role) {
                    queryConditions.AND = [];
                }

                // Filter berdasarkan keyword (bisa nama atau email)
                if (filters.keyword) {
                    queryConditions.AND.push({
                        OR: [
                            { email: { contains: filters.keyword } },
                            { nama: { contains: filters.keyword } },
                        ],
                    });
                }

                // Filter berdasarkan Rumah Sakit
                if (filters.rumahSakitId) {
                    queryConditions.AND.push({
                        masterRumahSakitId: filters.rumahSakitId,
                    });
                }

                // Filter berdasarkan Ruangan
                if (filters.ruanganId) {
                    queryConditions.AND.push({
                        masterRuanganRSId: filters.ruanganId,
                    });
                }

                // Filter berdasarkan Role
                if (filters.role) {
                    queryConditions.AND.push({
                        role: filters.role,
                    });
                }

                // Melakukan pencarian user berdasarkan kondisi yang sudah dibangun
                const accounts = await prisma.akun.findMany({
                    select: {
                        email: true,
                        iduser: true,
                        role: true,
                        last_login: true,
                        pendidikanTerakhir: true,
                        unitTempatBekerjaTerakhir: true,
                        MasterRuanganRS: true,
                        MasterRumahSakit: true,
                        masterRuanganRSId: true,
                        masterRumahSakitId: true,
                        created_at: true,
                        nama: true
                    },
                    where: queryConditions,
                });

                // Mengembalikan hasil pencarian sebagai array Akun[]
                reply.send(accounts as Akun[]);
            } catch (error) {
                console.log(error)
                reply.status(500).send({ error: 'Failed to search users' });
            }
        });
}

export default user;
