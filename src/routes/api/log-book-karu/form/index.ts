import { FastifyPluginAsync } from 'fastify';
import dayjs from 'dayjs'; import { JwtPayload } from 'app-type/index';
import { UserAssessmentListParams, UserLogbookKaruCreateRequest, UserLogbookKaruUpdateRequest } from 'app-type/request';
import { UserLogbookKaruResponse, ErrorResponse } from 'app-type/response';
'app-type/request';

const logbookKaru: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { prisma } = fastify;

    // Create or Update User LogbookKaru
    fastify.post<{
        Body: UserLogbookKaruCreateRequest;
        Reply: UserLogbookKaruResponse | ErrorResponse;
    }>('/create-answer', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id_master_logbook_karus, answers, userAsesmenId } = request.body;
            const { email } = await request.jwtDecode() as JwtPayload;

            const akun = await prisma.akun.findFirst({ where: { email } });
            const today = dayjs().startOf('day').toDate();

            // Check if the user has already submitted a logbook for the given assessment
            const existingLogbook = await prisma.userLogbookKaru.findFirst({
                where: {
                    email,
                    userAsesmenId,
                },
            });

            if (existingLogbook) {
                reply.status(500).send({ error: "Anda sudah mengisi logbook untuk asesmen ini." });
            } else {
                // Get all active logbook entries by IDs
                const activeLogbooks = await prisma.masterLogBookKaru.findMany({
                    where: {
                        id: { in: id_master_logbook_karus.map(s => parseInt(s)) },
                        status: 1 // Assuming status 1 means active
                    }
                });

                const jawabanData = answers.map(answer => {
                    const logbook = activeLogbooks.find(q => q.id === answer.id);
                    const score = answer.jawaban; // Assuming jawaban is a score or similar
                    return {
                        jawaban: score,
                        idMasterLogBookKaru: answer.id,
                    };
                });

                // Create a new logbook entry
                const newLogbook = await prisma.userLogbookKaru.create({
                    data: {
                        email,
                        userAsesmenId,
                        idMasterLogBooks: JSON.stringify(id_master_logbook_karus),
                        jawabanLogBook: {
                            create: jawabanData,
                        },
                    },
                    include: {
                        jawabanLogBook: true,
                    },
                });

                return reply.status(201).send({
                    id: newLogbook.id,
                    id_master_logbook_karus: JSON.parse(newLogbook.idMasterLogBooks || "[]"),
                    answers: newLogbook.jawabanLogBook.map(j => ({ id: j.idMasterLogBookKaru, jawaban: j.jawaban })),
                } as UserLogbookKaruResponse);
            }
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Failed to submit logbook entry" });
        }
    });

    // Update logbook entry
    fastify.post<{
        Body: UserLogbookKaruUpdateRequest;
        Reply: UserLogbookKaruResponse | ErrorResponse;
    }>('/update-answer', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id_user_logbook_karu, answers } = request.body;
            const { email } = await request.jwtDecode() as JwtPayload;

            const existingLogbook = await prisma.userLogbookKaru.findFirst({
                where: {
                    email,
                    id: id_user_logbook_karu
                },
            });

            if (existingLogbook) {
                const activeLogbooks = await prisma.masterLogBookKaru.findMany({
                    where: {
                        id: { in: [...JSON.parse(existingLogbook.idMasterLogBooks || "[]")].map(s => parseInt(s)) },
                    }
                });

                const jawabanData = answers.map(answer => {
                    return {
                        jawaban: answer.jawaban,
                        idMasterLogBookKaru: answer.id,
                    };
                });

                // Update the existing logbook entry
                const updatedLogbook = await prisma.userLogbookKaru.update({
                    where: { id: existingLogbook.id },
                    data: {
                        updated_at: dayjs().toDate(),
                        jawabanLogBook: {
                            deleteMany: {}, // Clear previous answers
                            create: jawabanData,
                        },
                    },
                    include: {
                        jawabanLogBook: true,
                    },
                });

                return reply.status(200).send({
                    id: updatedLogbook.id,
                    answers: updatedLogbook.jawabanLogBook.map(j => ({ id: j.idMasterLogBookKaru, jawaban: j.jawaban })),
                } as UserLogbookKaruResponse);
            } else {
                reply.status(500).send({ error: "Data didn't exist" });
            }
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Failed to update logbook entry" });
        }
    });

};

export default logbookKaru;
