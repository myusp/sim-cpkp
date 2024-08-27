import { JwtPayload } from 'app-type/index';
import dayjs from 'dayjs';
import { FastifyPluginAsync } from 'fastify';
import { omit, sumBy } from 'lodash';

const assesmenPenilaianKaru: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { prisma } = fastify
    fastify.get<{
        Querystring: { email?: string, ruanganRSId?: string, rumahSakitId?: string };
    }>('/list',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            try {
                const { email, ruanganRSId, rumahSakitId } = request.query;
                const assessment = await prisma.userPenilaianKaru.findMany({
                    where: {
                        AND: [
                            email ? { Akun: { email } } : {},
                            rumahSakitId ? { AkunPerawat: { masterRumahSakitId: rumahSakitId } } : {},
                            ruanganRSId ? { AkunPerawat: { masterRuanganRSId: ruanganRSId } } : {},
                        ],
                    },
                    include: {
                        UserAssesmen: true,
                        Akun: {
                            select: {
                                nama: true,
                                email: true,
                                MasterRuanganRS: true,
                                MasterRumahSakit: true,
                            }
                        },
                        AkunPerawat: {
                            select: {
                                nama: true,
                                email: true,
                                MasterRuanganRS: true,
                                MasterRumahSakit: true,
                            }
                        },

                    },
                });

                const data = {
                    data: assessment.map(d => {
                        const a = omit(d, ["Akun", "UserAssesmen", ""])
                        return {
                            assesmen: { ...a },
                            akun: d.Akun,
                            UserAssesmen: d.UserAssesmen,
                            AkunPerawat: d.AkunPerawat
                        }
                    })
                }

                return reply.status(200).send(data);
            } catch (error) {
                console.log(error)
                reply.status(500).send({ error: "Failed to fetch assessment " });
            }
        });

    fastify.post("/answer", { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            // reply.send("RE")
            const { emailPerawat, listTanggal, answer, idMasterPenilaianKaru } = request.body as { emailPerawat: string, idMasterPenilaianKaru: string[], listTanggal: string[], answer: { id: number, answer: number }[] }
            const d = await request.jwtDecode() as JwtPayload
            const listTglSorted = listTanggal.sort((a, b) => {
                const dateA = dayjs(a);
                const dateB = dayjs(b);
                return dateA.isBefore(dateB) ? -1 : 1;
            })
            // check if exist
            const row = await prisma.userPenilaianKaru.findFirst({
                where: {
                    email: d.email,
                    email_perawat: emailPerawat,
                    tanggal: listTglSorted.join(",")
                }
            })
            const now = dayjs().toDate()
            const score = sumBy(answer, (o) => o.answer) / answer.length
            if (row?.id) {
                await prisma.userPenilaianKaru.update({
                    data: {
                        score,
                        updated_at: now,
                    },
                    where: {
                        id: row.id
                    }
                })
                await prisma.userJawabanPenilaianKaru.deleteMany({
                    where: { idUserPenilaianKaru: row.id }
                })
                await Promise.all(answer.map(aw => {
                    return prisma.userJawabanPenilaianKaru.create({
                        data: {
                            idMasterPenilaianKaru: aw.id,
                            idUserPenilaianKaru: `${row.id}`,
                            Skor: aw.answer
                        }
                    })
                }))
                await prisma.userAssesmen.updateMany({
                    data: {
                        id_penilaian: null
                    },
                    where: {
                        id: row.id
                    }
                })
                await prisma.userAssesmen.updateMany({
                    data: {
                        id_penilaian: row.id
                    },
                    where: {
                        email: emailPerawat,
                        tanggal: {
                            in: listTanggal.map(d => dayjs(d).startOf("day").toDate())
                        }
                    }
                })
                return { message: "Berhasil memeperbarui logbook" }
            } else {
                const cr = await prisma.userPenilaianKaru.create({
                    data: {
                        idMasterPenilaianKaru: JSON.stringify(idMasterPenilaianKaru),
                        updated_at: now,
                        email: d.email,
                        email_perawat: emailPerawat,
                        score

                    }
                })
                await Promise.all(answer.map(aw => {
                    return prisma.userJawabanPenilaianKaru.create({
                        data: {
                            idMasterPenilaianKaru: aw.id,
                            idUserPenilaianKaru: cr.id,
                            Skor: aw.answer
                        }
                    })
                }))
                await prisma.userAssesmen.updateMany({
                    data: {
                        id_penilaian: cr.id
                    },
                    where: {
                        email: emailPerawat,
                        tanggal: {
                            in: listTanggal.map(d => dayjs(d).startOf("day").toDate())
                        }
                    }
                })
                return { message: "Berhasil membuat penilaian" }
            }
        } catch (error) {
            console.log("error", error)
            return reply.status(500).send({ message: error })
        }

    })


    fastify.get("/view-detail", {
        onRequest: [fastify.authenticate]
    }, async function (request, reply) {
        try {
            // reply.send("RE")
            const { idUserPenilaianKaru } = request.query as { idUserPenilaianKaru: string }
            // const d = await request.jwtDecode() as JwtPayload
            // check if exist
            const data = await prisma.userPenilaianKaru.findFirst({
                include: {
                    Akun: true,
                    AkunPerawat: true,
                    UserJawabanPenilaianKaru: {
                        include: {
                            MasterPenilaianKaru: true,
                        }
                    },
                    UserAssesmen: {
                        select: {
                            tanggal: true
                        }
                    },
                },
                where: {
                    id: idUserPenilaianKaru
                }
            })
            return data
        } catch (error) {
            console.log("error", error)
            return reply.status(500).send({ message: error })
        }

    })


};

export default assesmenPenilaianKaru;
