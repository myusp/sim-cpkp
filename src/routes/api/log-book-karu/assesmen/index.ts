import { JwtPayload } from 'app-type/index';
import dayjs from 'dayjs';
import { FastifyPluginAsync } from 'fastify';
import { omit } from 'lodash';

const assesmenLogBookKaru: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { prisma } = fastify
    fastify.get<{
        Querystring: { email?: string, ruanganRSId?: string, rumahSakitId?: string, statusLogBook?: string };
    }>('/list',
        { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            try {
                const { email, ruanganRSId, rumahSakitId, statusLogBook } = request.query;
                const assessment = await prisma.userAssesmen.findMany({
                    where: {
                        AND: [
                            email ? { Akun: { email } } : {},
                            rumahSakitId ? { Akun: { masterRumahSakitId: rumahSakitId } } : {},
                            ruanganRSId ? { Akun: { masterRuanganRSId: ruanganRSId } } : {},
                            statusLogBook ? {
                                UserLogbookKaru: statusLogBook == "1" ? {
                                    some: {

                                    }
                                } : statusLogBook == "0" ? {
                                    none: {}
                                } : {}
                            } : {}
                        ],
                    },
                    include: {
                        UserLogbookKaru: {
                            select: {
                                id: true,
                                created_at: true,
                                updated_at: true,
                            }
                        },
                        Akun: {
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
                        const a = omit(d, ["Akun", "UserLogbookKaru"])
                        return {
                            assesmen: { ...a },
                            akun: d.Akun,
                            logBookKaru: d.UserLogbookKaru
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
            const { userAsesmenId, idMasterLogBooks, answer } = request.body as { userAsesmenId: string, idMasterLogBooks: string[], answer: { id: number, answer: number }[] }
            const d = await request.jwtDecode() as JwtPayload
            // check if exist
            const row = await prisma.userLogbookKaru.findFirst({
                where: {
                    email: d.email,
                    userAsesmenId
                },
                include: {
                    UserAssesmen: true,
                }
            })
            const now = dayjs().toDate()
            if (row?.id) {
                if (row.UserAssesmen.id_penilaian != null) {
                    return reply.status(500).send({ message: "Anda tidak bisa mengubah log book untuk asesmen yang sudah dinilai" })
                }
                await prisma.userLogbookKaru.update({
                    data: {
                        idMasterLogBooks: JSON.stringify(idMasterLogBooks),
                        updated_at: now
                    },
                    where: {
                        id: row.id
                    }
                })
                await prisma.userJawabanLogBookKaru.deleteMany({ where: { idUserLogBookKaru: row.id } })
                await Promise.all(answer.map(aw => {
                    return prisma.userJawabanLogBookKaru.create({
                        data: {
                            idMasterLogBookKaru: aw.id,
                            idUserLogBookKaru: row.id,
                            jawaban: aw.answer
                        }
                    })
                }))
                return { message: "Berhasil memeperbarui logbook" }
            } else {
                const cr = await prisma.userLogbookKaru.create({
                    data: {
                        idMasterLogBooks: JSON.stringify(idMasterLogBooks),
                        updated_at: now,
                        email: d.email,
                        userAsesmenId
                    }
                })
                await Promise.all(answer.map(aw => {
                    return prisma.userJawabanLogBookKaru.create({
                        data: {
                            idMasterLogBookKaru: aw.id,
                            idUserLogBookKaru: cr.id,
                            jawaban: aw.answer
                        }
                    })
                }))
                return { message: "Berhasil membuat log book" }
            }
        } catch (error) {
            console.log("error", error)
            return reply.status(500).send({ message: error })
        }

    })

    fastify.get("/answer-by-userAsesmenId", { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            // reply.send("RE")
            const { userAsesmenId } = request.query as { userAsesmenId: string, }
            // const d = await request.jwtDecode() as JwtPayload
            const resp = await prisma.userLogbookKaru.findFirst({
                include: {
                    jawabanLogBook: true,
                },
                where: {
                    userAsesmenId
                }
            })
            return resp
        } catch (error) {
            console.log("error", error)
            return reply.status(500).send({ message: error })
        }

    })


};

export default assesmenLogBookKaru;
