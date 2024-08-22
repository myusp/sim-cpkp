import { FastifyPluginAsync } from 'fastify';
import dayjs from 'dayjs';
import { UserAssessmentCreateRequest, UserAssessmentListParams, UserAssessmentParams, UserAssessmentUpdateRequest } from 'app-type/request';
import { UserAssessmentResponse, ErrorResponse, UserAssessmentListResponse, UserAssessmentViewResponse } from 'app-type/response';
import { Akun, JwtPayload, UserAssesmen } from 'app-type/index';
import { groupBy, omit } from "lodash"

const assessment: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { prisma } = fastify;

    // Create or Update User Assessment
    fastify.post<{
        Body: UserAssessmentCreateRequest;
        Reply: UserAssessmentResponse | ErrorResponse;
    }>('/create-answer', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id_master_pertanyaans, answers, tanggal } = request.body;
            const { email } = await request.jwtDecode() as JwtPayload;
            const akun = await prisma.akun.findFirst({ where: { email } });

            let today = dayjs().startOf('day').toDate();
            if (tanggal) {
                today = dayjs(tanggal).startOf("day").toDate()
                // console.log(tanggal, today)
            }


            // Check if the user has already submitted an assessment today
            const existingAssessment = await prisma.userAssesmen.findFirst({
                where: {
                    email,
                    tanggal: today,
                },
            });

            const ScorPerSKP: Record<string, number> = {
                SKP1: 0,
                SKP2: 0,
                SKP3: 0,
                SKP4: 0,
                SKP5: 0,
                SKP6: 0,
            }

            if (existingAssessment) {
                reply.status(500).send({ error: `Anda sudah mengisi self-asesmen hari ini, silakan klik menu self asesmen tanggal ${dayjs(today).format("YYYY-MM-DD")} untuk melakukan update` })
            } else {
                // Get all active questions by IDs
                const activeQuestions = await prisma.masterPertanyaanAssesmen.findMany({
                    where: {
                        id: { in: id_master_pertanyaans.map(s => parseInt(s)) },
                        status: 1 // Assuming status 1 means active
                    }
                });
                const groupedActiveQusetions = groupBy(activeQuestions, (aq) => aq.skp)
                // console.log(answers)

                const jawabanData = answers.map(answer => {
                    const question = activeQuestions.find(q => q.id === answer.id);
                    const correctAnswer = getCorrectAnswer(question, akun?.pendidikanTerakhir as string);
                    const score = (answer.answer === correctAnswer) ? 1 : 0;
                    if (!ScorPerSKP[question?.skp as string]) {
                        ScorPerSKP[question?.skp as string] = 0
                    }
                    ScorPerSKP[question?.skp as string] = ScorPerSKP[question?.skp as string] + score
                    return {
                        jawaban: answer.answer,
                        skor: score,
                        MasterPertanyaanAssesmenId: answer.id,
                    };
                });
                // Create a new assessment
                const newAssessment = await prisma.userAssesmen.create({
                    data: {
                        email,
                        tanggal: today,
                        skp_1: `${(100 * ScorPerSKP["SKP1"]) / groupedActiveQusetions["SKP1"].length}` || "0",
                        skp_2: `${(100 * ScorPerSKP["SKP2"]) / groupedActiveQusetions["SKP2"].length}` || "0",
                        skp_3: `${(100 * ScorPerSKP["SKP3"]) / groupedActiveQusetions["SKP3"].length}` || "0",
                        skp_4: `${(100 * ScorPerSKP["SKP4"]) / groupedActiveQusetions["SKP4"].length}` || "0",
                        skp_5: `${(100 * ScorPerSKP["SKP5"]) / groupedActiveQusetions["SKP5"].length}` || "0",
                        skp_6: `${(100 * ScorPerSKP["SKP6"]) / groupedActiveQusetions["SKP6"].length}` || "0",
                        id_master_pertanyaans: JSON.stringify(id_master_pertanyaans),
                        jawaban: {
                            create: jawabanData,
                        },
                    },
                    include: {
                        jawaban: true,
                    },
                });

                return reply.status(201).send({
                    id: newAssessment.id,
                    id_master_pertanyaans: JSON.parse(newAssessment.id_master_pertanyaans || "[]"),
                    skp_1: newAssessment.skp_1 ? parseInt(newAssessment.skp_1) : 0,
                    skp_2: newAssessment.skp_2 ? parseInt(newAssessment.skp_2) : 0,
                    skp_3: newAssessment.skp_3 ? parseInt(newAssessment.skp_3) : 0,
                    skp_4: newAssessment.skp_4 ? parseInt(newAssessment.skp_4) : 0,
                    skp_5: newAssessment.skp_5 ? parseInt(newAssessment.skp_5) : 0,
                    skp_6: newAssessment.skp_6 ? parseInt(newAssessment.skp_6) : 0,
                    answers: newAssessment.jawaban.map(j => ({ id: j.MasterPertanyaanAssesmenId, answer: j.jawaban })),
                } as UserAssessmentResponse);
            }
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: "Failed to submit assessment" });
        }
    });

    fastify.post<{
        Body: UserAssessmentUpdateRequest;
        Reply: UserAssessmentResponse | ErrorResponse;
    }>('/update-answer', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id_user_assesmen, answers } = request.body;
            const { email } = await request.jwtDecode() as JwtPayload;
            const akun = await prisma.akun.findFirst({ where: { email } });

            const today = dayjs().startOf('day').toDate();

            // Check if the user has already submitted an assessment today
            const existingAssessment = await prisma.userAssesmen.findFirst({
                where: {
                    email,
                    id: id_user_assesmen
                },
            });

            const ScorPerSKP: Record<string, number> = {
                SKP1: 0,
                SKP2: 0,
                SKP3: 0,
                SKP4: 0,
                SKP5: 0,
                SKP6: 0,
            }

            if (existingAssessment) {
                if (dayjs().diff(existingAssessment.tanggal, 'day') > 7 || existingAssessment.id_penilaian !== null) {
                    return reply.status(403).send({ error: "Assessment cannot be updated after 7 days or once it has been reviewed." });
                }
                const activeQuestions = await prisma.masterPertanyaanAssesmen.findMany({
                    where: {
                        id: { in: [...JSON.parse(existingAssessment?.id_master_pertanyaans || "[]")].map(s => parseInt(s)) },
                    }
                });
                const groupedActiveQusetions = groupBy(activeQuestions, (aq) => aq.skp)
                // console.log(answers)

                const jawabanData = answers.map(answer => {
                    const question = activeQuestions.find(q => q.id === answer.id);
                    const correctAnswer = getCorrectAnswer(question, akun?.pendidikanTerakhir as string);
                    const score = (answer.answer === correctAnswer) ? 1 : 0;
                    if (!ScorPerSKP[question?.skp as string]) {
                        ScorPerSKP[question?.skp as string] = 0
                    }
                    ScorPerSKP[question?.skp as string] = ScorPerSKP[question?.skp as string] + score
                    return {
                        jawaban: answer.answer,
                        skor: score,
                        MasterPertanyaanAssesmenId: answer.id,
                    };
                });
                // Update the existing assessment
                const updatedAssessment = await prisma.userAssesmen.update({
                    where: { id: existingAssessment.id },
                    data: {
                        skp_1: `${(100 * ScorPerSKP["SKP1"]) / groupedActiveQusetions["SKP1"].length}` || "0",
                        skp_2: `${(100 * ScorPerSKP["SKP2"]) / groupedActiveQusetions["SKP2"].length}` || "0",
                        skp_3: `${(100 * ScorPerSKP["SKP3"]) / groupedActiveQusetions["SKP3"].length}` || "0",
                        skp_4: `${(100 * ScorPerSKP["SKP4"]) / groupedActiveQusetions["SKP4"].length}` || "0",
                        skp_5: `${(100 * ScorPerSKP["SKP5"]) / groupedActiveQusetions["SKP5"].length}` || "0",
                        skp_6: `${(100 * ScorPerSKP["SKP6"]) / groupedActiveQusetions["SKP6"].length}` || "0",
                        updated_at: today,
                        jawaban: {
                            deleteMany: {}, // Clear previous answers
                            create: jawabanData,
                        },
                    },
                    include: {
                        jawaban: true,
                    },
                });

                return reply.status(200).send({
                    id: updatedAssessment.id,
                    skp_1: updatedAssessment.skp_1 ? parseInt(updatedAssessment.skp_1) : 0,
                    skp_2: updatedAssessment.skp_2 ? parseInt(updatedAssessment.skp_2) : 0,
                    skp_3: updatedAssessment.skp_3 ? parseInt(updatedAssessment.skp_3) : 0,
                    skp_4: updatedAssessment.skp_4 ? parseInt(updatedAssessment.skp_4) : 0,
                    skp_5: updatedAssessment.skp_5 ? parseInt(updatedAssessment.skp_5) : 0,
                    skp_6: updatedAssessment.skp_6 ? parseInt(updatedAssessment.skp_6) : 0,
                    answers: updatedAssessment.jawaban.map(j => ({ id: j.MasterPertanyaanAssesmenId, answer: j.jawaban })),
                } as UserAssessmentResponse);
            } else {
                // Get all active questions by IDs
                reply.status(500).send({ error: "Data didn't exist" })
            }
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: "Failed to submit assessment" });
        }
    });

    // Get User Assessment
    fastify.get<{
        Params: UserAssessmentParams;
        Reply: UserAssessmentViewResponse | ErrorResponse;
    }>('/view/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const assessment = await prisma.userAssesmen.findUnique({
                where: { id },
                include: {
                    jawaban: true,
                },
            });

            if (!assessment) {
                return reply.status(404).send({ error: "Assessment not found" });
            }

            const question = await prisma.masterPertanyaanAssesmen.findMany({
                select: {
                    id: true,
                    skp: true,
                    sub_kategori: true,
                    keterampilan: true,
                    priority: true,
                    tipe: true
                },
                where: {
                    id: { in: [...JSON.parse(assessment.id_master_pertanyaans || "[]")].map(i => parseInt(i)) }
                }
            })
            return reply.status(200).send({
                assesmen: omit(assessment, ["jawaban"]) as UserAssesmen,
                answer: assessment.jawaban.map(j => ({ answer: j.jawaban, id: j.MasterPertanyaanAssesmenId })),
                questions: question.map(q => ({
                    id: q.id,
                    keterampilan: q.keterampilan || "",
                    priority: q.priority || 1,
                    sub_kategori: q.sub_kategori || "",
                    tipe: q.tipe || "",
                    skp: q.skp || ""
                }))
            });
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: "Failed to fetch assessment summary" });
        }
    });

    fastify.get<{
        Querystring: UserAssessmentListParams;
        Reply: UserAssessmentListResponse | ErrorResponse;
    }>('/list', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { email, ruanganRSId, rumahSakitId, statusPenilaian } = request.query;
            const assessment = await prisma.userAssesmen.findMany({
                where: {
                    AND: [
                        email ? { Akun: { email } } : {},
                        rumahSakitId ? { Akun: { masterRumahSakitId: rumahSakitId } } : {},
                        ruanganRSId ? { Akun: { masterRuanganRSId: ruanganRSId } } : {},
                        statusPenilaian ? {
                            id_penilaian: { not: null }
                        } : {}
                    ],
                },
                include: {
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

            const data: UserAssessmentListResponse = {
                data: assessment.map(d => {
                    const a = omit(d, "Akun")
                    return {
                        assesmen: { ...a } as UserAssesmen,
                        akun: d.Akun as unknown as Akun
                    }
                })
            }

            return reply.status(200).send(data);
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch assessment summary" });
        }
    });

    // Utility function to get the correct answer based on the user's education level
    function getCorrectAnswer(question: any, pendidikanTerakhir: string | null): string {
        if (!question) return '';

        if (pendidikanTerakhir === 'NERS' || pendidikanTerakhir === 'S2_KEP') {
            return question.ners;
        } else if (pendidikanTerakhir === 'VOKASI') {
            return question.vokasi;
        }

        return ''; // Default if no match
    }

};

export default assessment;
