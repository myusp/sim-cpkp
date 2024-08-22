import { FastifyPluginAsync } from 'fastify';
import { omit } from 'lodash';

const assesmenLogBookKaru: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { prisma } = fastify
    fastify.get<{
        Querystring: { email?: string, ruanganRSId?: string, rumahSakitId?: string, statusLogBook?: string };
    }>('/list',
        // { onRequest: [fastify.authenticate] },
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

};

export default assesmenLogBookKaru;
