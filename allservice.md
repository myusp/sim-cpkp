src/routes/api/assesment
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

            // const today = dayjs().startOf('day').toDate();

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
                // if (dayjs().diff(existingAssessment.tanggal, 'day') > 7 || existingAssessment.id_penilaian !== null) {
                //     return reply.status(403).send({ error: "Assessment cannot be updated after 7 days or once it has been reviewed." });
                // }
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
                        updated_at: dayjs().toDate(),
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
        Params: UserAssessmentParams;
    }>('/view-head/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const assessment = await prisma.userAssesmen.findUnique({
                where: { id },
                include: {
                    Akun: true,
                },
            });

            if (!assessment) {
                return reply.status(404).send({ error: "Assessment not found" });
            }

            return reply.status(200).send(assessment);
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

    fastify.get<{
        Querystring: { ruanganRSId: string, rumahSakitId: string, tgl: string };
    }>('/list-user-status',
        // { onRequest: [fastify.authenticate] },
        async function (request, reply) {
            try {
                const { ruanganRSId, rumahSakitId, tgl } = request.query;
                const date = dayjs(tgl)
                if (!date.isValid()) {
                    throw "invalid date query"
                }
                const users = await prisma.akun.findMany({
                    where: {
                        ...(ruanganRSId && { masterRuanganRSId: ruanganRSId }),
                        ...(rumahSakitId && { masterRumahSakitId: rumahSakitId }),
                        role: "perawat"
                    },
                    select: {
                        email: true,
                        nama: true,
                    }
                });
                const assessment = await prisma.userAssesmen.findMany({
                    select: {
                        id: true,
                        skp_1: true,
                        skp_2: true,
                        skp_3: true,
                        skp_4: true,
                        skp_5: true,
                        skp_6: true,
                        email: true
                    },
                    where: {
                        AND: [
                            {
                                email: {
                                    in: users.map(u => u.email)
                                }
                            },
                            {
                                tanggal: date.toDate()
                            }
                        ],
                    },
                });


                return reply.status(200).send(users.map(u => {
                    const assmn = assessment.find(a => a.email == u.email)
                    return {
                        user: u,
                        asesmen: assmn ? assmn : null,
                        status: !!assmn
                    }
                }));
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


src/routes/api/auth
import { FastifyPluginAsync } from "fastify"
import dayjs from "dayjs"
import { LoginRequest } from "app-type/request"
import { LoginResponse } from "app-type/response"
import { JwtPayload } from "app-type/index"

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { verifyPassword } = fastify

    fastify.post('/login', async function (request, reply) {
        const { email, password } = request.body as LoginRequest

        const akun = await fastify.prisma.akun.findFirst({
            where: {
                email
            }
        })
        if (!akun) {
            return reply.send({
                message: "email atau password salah"
            })
        }
        if (!verifyPassword(password || "", akun.password)) {
            return reply.send({
                message: "email atau password salah"
            })
        }
        const pld: JwtPayload = {
            email: akun.email,
            created: dayjs().unix(),
            name: akun.nama,
            role: akun.role,
            id_rs: akun.masterRumahSakitId,
            id_ruangan: akun.masterRuanganRSId
        }
        await fastify.prisma.akun.update({
            where: { email: email },
            data: {
                last_login: dayjs().toDate()
            }
        })
        return reply.send({
            token: fastify.jwt.sign(pld)
        } as LoginResponse)

    })

}

export default auth;


src/routes/api/hospitals
import { HospitalParams, HospitalBody } from "app-type/request";
import { ErrorResponse, HospitalResponse } from "app-type/response";
import { FastifyPluginAsync } from "fastify";


const hospital: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Get all hospitals
    fastify.get<{ Reply: HospitalResponse[] | ErrorResponse }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const hospitals = await fastify.prisma.masterRumahSakit.findMany();
            return hospitals;
        } catch (error) {
            console.log(error)
            reply.status(500);
            return { error: "Failed to fetch hospitals" };
        }
    });

    // Get a hospital by ID
    fastify.get<{ Params: HospitalParams; Reply: HospitalResponse | ErrorResponse }>('/by-id/:hospital_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { hospital_id } = request.params;
            const hospital = await fastify.prisma.masterRumahSakit.findFirst({
                where: { id: hospital_id },
            });

            if (!hospital) {
                reply.status(404);
                return { error: "Hospital not found" };
            }

            return hospital;
        } catch (error) {
            reply.status(500);
            return { error: "Failed to fetch hospital" };
        }
    });

    // Create a new hospital
    fastify.post<{ Body: HospitalBody; Reply: HospitalResponse | ErrorResponse }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { nama } = request.body;
            const newHospital = await fastify.prisma.masterRumahSakit.create({
                data: { nama },
            });

            reply.status(201);
            return newHospital;
        } catch (error) {
            reply.status(500);
            return { error: "Failed to create hospital" };
        }
    });

    // Update a hospital by ID
    fastify.put<{ Params: HospitalParams; Body: HospitalBody; Reply: HospitalResponse | ErrorResponse }>('/by-id/:hospital_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { hospital_id } = request.params;
            const { nama } = request.body;

            const updatedHospital = await fastify.prisma.masterRumahSakit.update({
                where: { id: hospital_id },
                data: { nama },
            });

            return updatedHospital;
        } catch (error) {
            reply.status(500);
            return { error: "Failed to update hospital" };
        }
    });

    // Delete a hospital by ID
    fastify.delete<{ Params: HospitalParams; Reply: { message: string } | ErrorResponse }>('/by-id/:hospital_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { hospital_id } = request.params;

            await fastify.prisma.masterRumahSakit.delete({
                where: { id: hospital_id },
            });

            return { message: "Hospital deleted successfully" };
        } catch (error) {
            reply.status(500);
            return { error: "Failed to delete hospital" };
        }
    });
};

export default hospital;


src/routes/api/log-book-karu/index.ts
import { MasterLogBookKaruParams, MasterLogBookKaruCreateRequest, MasterLogBookKaruUpdateRequest } from 'app-type/request';
import { ErrorResponse, MasterLogBookKaruActiveResponse, MasterLogBookKaruResponse } from 'app-type/response';
import { FastifyPluginAsync } from 'fastify';

const masterLogBookKaru: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Get all master logbook karu
    fastify.get<{
        Reply: MasterLogBookKaruResponse[] | ErrorResponse
    }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const logBooks = await fastify.prisma.masterLogBookKaru.findMany();
            return logBooks as MasterLogBookKaruResponse[];
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch logbooks" });
        }
    });

    // Get a master logbook karu by ID
    fastify.get<{
        Params: MasterLogBookKaruParams;
        Reply: MasterLogBookKaruResponse | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const logBook = await fastify.prisma.masterLogBookKaru.findUnique({
                where: { id: parseInt(`${id}`) },
            });

            if (!logBook) {
                reply.status(404).send({ error: "Logbook not found" });
            } else {
                return logBook as MasterLogBookKaruResponse;
            }
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch logbook" });
        }
    });

    // Create a new master logbook karu
    fastify.post<{
        Body: MasterLogBookKaruCreateRequest;
        Reply: MasterLogBookKaruResponse | ErrorResponse;
    }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const newLogBook = await fastify.prisma.masterLogBookKaru.create({
                data: request.body,
            });

            reply.status(201).send(newLogBook as MasterLogBookKaruResponse);
        } catch (error) {
            reply.status(500).send({ error: "Failed to create logbook" });
        }
    });

    // Update a master logbook karu by ID
    fastify.put<{
        Params: MasterLogBookKaruParams;
        Body: MasterLogBookKaruUpdateRequest;
        Reply: MasterLogBookKaruResponse | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const updatedLogBook = await fastify.prisma.masterLogBookKaru.update({
                where: { id: parseInt(`${id}`) },
                data: request.body,
            });

            return updatedLogBook as MasterLogBookKaruResponse;
        } catch (error) {
            reply.status(500).send({ error: "Failed to update logbook" });
        }
    });

    // Delete a master logbook karu by ID
    fastify.delete<{
        Params: MasterLogBookKaruParams;
        Reply: { message: string } | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;

            await fastify.prisma.masterLogBookKaru.delete({
                where: { id: parseInt(`${id}`) },
            });

            return { message: "Logbook deleted successfully" };
        } catch (error) {
            reply.status(500).send({ error: "Failed to delete logbook" });
        }
    });

    // Get active logbooks with status = 1
    fastify.get<{
        Reply: MasterLogBookKaruActiveResponse[] | ErrorResponse;
    }>('/active', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const activeLogBooks = await fastify.prisma.masterLogBookKaru.findMany({
                where: {
                    status: 1,
                },
                select: {
                    id: true,
                    skp: true,
                    kegiatan: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                },
            });

            return activeLogBooks as MasterLogBookKaruActiveResponse[];
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch active logbooks" });
        }
    });
};

export default masterLogBookKaru;

src/routes/api/log-book-karu/assesmen/index.ts
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

src/routes/api/master-cpd/index.ts
import { FastifyPluginAsync } from 'fastify';
import { CpdParams, CpdBody } from 'app-type/request';
import { CpdListResponse, ErrorResponse, CpdResponse } from 'app-type/response';



const masterCpd: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Helper function to add 'pk' to response
    const addPkToResponse = <T extends { id: number; value: string }>(
        data: T[],
        pk: CpdResponse['pk']
    ): CpdResponse[] => {
        return data.map(item => ({
            ...item,
            pk,
        }));
    };

    const { prisma } = fastify

    // Get CPD list
    fastify.get<{ Querystring: Partial<CpdParams>; Reply: CpdListResponse | ErrorResponse }>(
        '/',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            const { pk } = request.query;

            try {
                let data: CpdResponse[] = [];

                if (pk) {
                    let pkData: { id: number; value: string }[] = [];
                    switch (pk) {
                        case 'pk1':
                            pkData = await prisma.masterCPD_PK1.findMany();
                            break;
                        case 'pk2':
                            pkData = await prisma.masterCPD_PK2.findMany();
                            break;
                        case 'pk3':
                            pkData = await prisma.masterCPD_PK3.findMany();
                            break;
                        case 'pk4':
                            pkData = await prisma.masterCPD_PK4.findMany();
                            break;
                        case 'pk5':
                            pkData = await prisma.masterCPD_PK5.findMany();
                            break;
                        default:
                            reply.status(400);
                            return { error: "PK tidak valid" };
                    }
                    data = addPkToResponse(pkData, pk);
                } else {
                    const [pk1, pk2, pk3, pk4, pk5] = await Promise.all([
                        prisma.masterCPD_PK1.findMany(),
                        prisma.masterCPD_PK2.findMany(),
                        prisma.masterCPD_PK3.findMany(),
                        prisma.masterCPD_PK4.findMany(),
                        prisma.masterCPD_PK5.findMany(),
                    ]);

                    data = [
                        ...addPkToResponse(pk1, 'pk1'),
                        ...addPkToResponse(pk2, 'pk2'),
                        ...addPkToResponse(pk3, 'pk3'),
                        ...addPkToResponse(pk4, 'pk4'),
                        ...addPkToResponse(pk5, 'pk5'),
                    ];
                }

                return data;
            } catch (error) {
                reply.status(500);
                return { error: "Gagal mengambil data CPD" };
            }
        }
    );

    // Create new CPD
    fastify.post<{ Body: CpdBody & CpdParams; Reply: CpdResponse | ErrorResponse }>(
        '/',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            const { pk, value } = request.body;

            try {
                let newCPD: { id: number; value: string };

                switch (pk) {
                    case 'pk1':
                        newCPD = await prisma.masterCPD_PK1.create({
                            data: { value },
                        });
                        break;
                    case 'pk2':
                        newCPD = await prisma.masterCPD_PK2.create({
                            data: { value },
                        });
                        break;
                    case 'pk3':
                        newCPD = await prisma.masterCPD_PK3.create({
                            data: { value },
                        });
                        break;
                    case 'pk4':
                        newCPD = await prisma.masterCPD_PK4.create({
                            data: { value },
                        });
                        break;
                    case 'pk5':
                        newCPD = await prisma.masterCPD_PK5.create({
                            data: { value },
                        });
                        break;
                    default:
                        reply.status(400);
                        return { error: "PK tidak valid" };
                }

                reply.status(201);
                return { ...newCPD, pk };
            } catch (error) {
                reply.status(500);
                return { error: "Gagal membuat CPD baru" };
            }
        }
    );

    // Update CPD by ID
    fastify.put<{ Params: { id: string }; Body: CpdBody & CpdParams; Reply: CpdResponse | ErrorResponse }>(
        '/:id',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            const { id } = request.params;
            const { pk, value } = request.body;

            try {
                let updatedCPD: { id: number; value: string };

                switch (pk) {
                    case 'pk1':
                        updatedCPD = await prisma.masterCPD_PK1.update({
                            where: { id: Number(id) },
                            data: { value },
                        });
                        break;
                    case 'pk2':
                        updatedCPD = await prisma.masterCPD_PK2.update({
                            where: { id: Number(id) },
                            data: { value },
                        });
                        break;
                    case 'pk3':
                        updatedCPD = await prisma.masterCPD_PK3.update({
                            where: { id: Number(id) },
                            data: { value },
                        });
                        break;
                    case 'pk4':
                        updatedCPD = await prisma.masterCPD_PK4.update({
                            where: { id: Number(id) },
                            data: { value },
                        });
                        break;
                    case 'pk5':
                        updatedCPD = await prisma.masterCPD_PK5.update({
                            where: { id: Number(id) },
                            data: { value },
                        });
                        break;
                    default:
                        reply.status(400);
                        return { error: "PK tidak valid" };
                }

                return { ...updatedCPD, pk };
            } catch (error) {
                reply.status(500);
                return { error: "Gagal memperbarui CPD" };
            }
        }
    );

    // Delete CPD by ID
    fastify.delete<{ Params: { id: string }; Body: CpdParams; Reply: { message: string } | ErrorResponse }>(
        '/:id',
        { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            const { id } = request.params;
            const { pk } = request.body;

            try {
                switch (pk) {
                    case 'pk1':
                        await prisma.masterCPD_PK1.delete({
                            where: { id: Number(id) },
                        });
                        break;
                    case 'pk2':
                        await prisma.masterCPD_PK2.delete({
                            where: { id: Number(id) },
                        });
                        break;
                    case 'pk3':
                        await prisma.masterCPD_PK3.delete({
                            where: { id: Number(id) },
                        });
                        break;
                    case 'pk4':
                        await prisma.masterCPD_PK4.delete({
                            where: { id: Number(id) },
                        });
                        break;
                    case 'pk5':
                        await prisma.masterCPD_PK5.delete({
                            where: { id: Number(id) },
                        });
                        break;
                    default:
                        reply.status(400);
                        return { error: "PK tidak valid" };
                }

                return { message: "CPD berhasil dihapus" };
            } catch (error) {
                reply.status(500);
                return { error: "Gagal menghapus CPD" };
            }
        }
    );
};

export default masterCpd;



src/routes/api/notifications/index.ts
import dayjs from 'dayjs';
import { FastifyPluginAsync } from 'fastify';

const notification: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Get all notifications for a specific nurse (toPerawatEmail)
    fastify.get<{ Querystring: { toPerawatEmail: string } }>('/getlistnotif',
        // { onRequest: [fastify.authenticate] },
        async (request, reply) => {
            try {
                const { toPerawatEmail } = request.query;
                const notifications = await fastify.prisma.notificationKaruToPerawat.findMany({
                    where: { toPerawatEmail },
                    orderBy: { createdAt: 'desc' },
                    select: {
                        fromKaru: {
                            select: {
                                email: true,
                                nama: true
                            }
                        },
                        selfAsesmenDate: true,
                        isRead: true,
                        createdAt: true,
                        message: true,
                        id: true,
                    }
                });
                return notifications;
            } catch (error) {
                reply.status(500);
                return { error: 'Failed to fetch notifications' };
            }
        });

    // Get unread notification count for a specific nurse (toPerawatEmail)
    fastify.get<{ Querystring: { toPerawatEmail: string } }>('/getcountnotif', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { toPerawatEmail } = request.query;
            const count = await fastify.prisma.notificationKaruToPerawat.count({
                where: { toPerawatEmail, isRead: false },
            });
            return { count };
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to get notification count' };
        }
    });

    // Mark a notification as read by notification ID
    fastify.put<{ Params: { id: string } }>('/readnotif/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { id } = request.params;
            await fastify.prisma.notificationKaruToPerawat.update({
                where: { id },
                data: { isRead: true },
            });
            return { message: "successs" };
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to mark notification as read' };
        }
    });

    // Send a notification from Karu to Perawat
    fastify.post<{ Body: { fromKaruEmail: string, toPerawatEmail: string, tgl: string } }>('/sendnotif', { onRequest: [fastify.authenticate] }, async (request, reply) => {
        try {
            const { fromKaruEmail, toPerawatEmail, tgl } = request.body;

            const date = dayjs(tgl)
            const newNotification = await fastify.prisma.notificationKaruToPerawat.create({
                data: {
                    fromKaruEmail,
                    toPerawatEmail,
                    message: "Pengingat ! Anda belum mengisi self asesmen tanggal " + date.format("YYYY-MM-DD"),
                    selfAsesmenDate: date.toDate()
                },
            });

            reply.status(201);
            return newNotification;
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to send notification' };
        }
    });
};

export default notification;


src/routes/api/orientasi/index.ts
import { FastifyPluginAsync } from 'fastify';
import { ErrorResponse } from 'app-type/response';
import { MasterOrientasi } from 'app-type/index';

const orientasi: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // Get all master orientasi
  fastify.get<{ Reply: MasterOrientasi[] | ErrorResponse }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
    try {
      const orientasiList = await fastify.prisma.masterOrientasi.findMany();
      return orientasiList;
    } catch (error) {
      console.log(error);
      reply.status(500);
      return { error: 'Failed to fetch master orientasi' };
    }
  });

  // Get a master orientasi by ID
  fastify.get<{ Params: { id: number }; Reply: MasterOrientasi | ErrorResponse }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
    try {
      const { id } = request.params;
      const orientasi = await fastify.prisma.masterOrientasi.findUnique({
        where: { id },
      });

      if (!orientasi) {
        reply.status(404);
        return { error: 'Master orientasi not found' };
      }

      return orientasi;
    } catch (error) {
      reply.status(500);
      return { error: 'Failed to fetch master orientasi' };
    }
  });

  // Create a new master orientasi
  fastify.post<{ Body: { value: string }; Reply: MasterOrientasi | ErrorResponse }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
    try {
      const { value } = request.body;
      const newOrientasi = await fastify.prisma.masterOrientasi.create({
        data: { value },
      });

      reply.status(201);
      return newOrientasi;
    } catch (error) {
      reply.status(500);
      return { error: 'Failed to create master orientasi' };
    }
  });

  // Update a master orientasi by ID
  fastify.put<{ Params: { id: number }; Body: { value: string }; Reply: MasterOrientasi | ErrorResponse }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
    try {
      const { id } = request.params;
      const { value } = request.body;

      const updatedOrientasi = await fastify.prisma.masterOrientasi.update({
        where: { id },
        data: { value },
      });

      return updatedOrientasi;
    } catch (error) {
      reply.status(500);
      return { error: 'Failed to update master orientasi' };
    }
  });

  // Delete a master orientasi by ID
  fastify.delete<{ Params: { id: number }; Reply: { message: string } | ErrorResponse }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
    try {
      const { id } = request.params;

      await fastify.prisma.masterOrientasi.delete({
        where: { id },
      });

      return { message: 'Master orientasi deleted successfully' };
    } catch (error) {
      reply.status(500);
      return { error: 'Failed to delete master orientasi' };
    }
  });
};

export default orientasi;


src/routes/api/pelatihan/index.ts
import { FastifyPluginAsync } from 'fastify';
import { ErrorResponse } from 'app-type/response';
import { MasterPelatihan } from 'app-type/index';

const pelatihan: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Get all master pelatihan
    fastify.get<{ Reply: MasterPelatihan[] | ErrorResponse }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const pelatihanList = await fastify.prisma.masterPelatihan.findMany();
            return pelatihanList;
        } catch (error) {
            console.log(error);
            reply.status(500);
            return { error: 'Failed to fetch master pelatihan' };
        }
    });

    // Get a master pelatihan by ID
    fastify.get<{ Params: { id: number }; Reply: MasterPelatihan | ErrorResponse }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const pelatihan = await fastify.prisma.masterPelatihan.findUnique({
                where: { id },
            });

            if (!pelatihan) {
                reply.status(404);
                return { error: 'Master pelatihan not found' };
            }

            return pelatihan;
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to fetch master pelatihan' };
        }
    });

    // Create a new master pelatihan
    fastify.post<{ Body: { value: string }; Reply: MasterPelatihan | ErrorResponse }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { value } = request.body;
            const newPelatihan = await fastify.prisma.masterPelatihan.create({
                data: { value },
            });

            reply.status(201);
            return newPelatihan;
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to create master pelatihan' };
        }
    });

    // Update a master pelatihan by ID
    fastify.put<{ Params: { id: number }; Body: { value: string }; Reply: MasterPelatihan | ErrorResponse }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const { value } = request.body;

            const updatedPelatihan = await fastify.prisma.masterPelatihan.update({
                where: { id },
                data: { value },
            });

            return updatedPelatihan;
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to update master pelatihan' };
        }
    });

    // Delete a master pelatihan by ID
    fastify.delete<{ Params: { id: number }; Reply: { message: string } | ErrorResponse }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;

            await fastify.prisma.masterPelatihan.delete({
                where: { id },
            });

            return { message: 'Master pelatihan deleted successfully' };
        } catch (error) {
            reply.status(500);
            return { error: 'Failed to delete master pelatihan' };
        }
    });
};

export default pelatihan;


src/routes/api/penilaian-karu/index.ts
import { MasterPenilaianKaruParams, MasterPenilaianKaruCreateRequest, MasterPenilaianKaruUpdateRequest } from 'app-type/request';
import { ErrorResponse, MasterPenilaianKaruResponse, MasterPenilaianKaruActiveResponse } from 'app-type/response';
import { FastifyPluginAsync } from 'fastify';

const masterPenilaianKaru: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Get all master penilaian karu
    fastify.get<{
        Reply: MasterPenilaianKaruResponse[] | ErrorResponse
    }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const evaluations = await fastify.prisma.masterPenilaianKaru.findMany();
            return evaluations as MasterPenilaianKaruResponse[];
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch evaluations" });
        }
    });

    // Get a master penilaian karu by ID
    fastify.get<{
        Params: MasterPenilaianKaruParams;
        Reply: MasterPenilaianKaruResponse | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const evaluation = await fastify.prisma.masterPenilaianKaru.findUnique({
                where: { id: parseInt(`${id}`) },
            });

            if (!evaluation) {
                reply.status(404).send({ error: "Evaluation not found" });
            } else {
                return evaluation as MasterPenilaianKaruResponse;
            }
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch evaluation" });
        }
    });

    // Create a new master penilaian karu
    fastify.post<{
        Body: MasterPenilaianKaruCreateRequest;
        Reply: MasterPenilaianKaruResponse | ErrorResponse;
    }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const newEvaluation = await fastify.prisma.masterPenilaianKaru.create({
                data: request.body,
            });

            reply.status(201).send(newEvaluation as MasterPenilaianKaruResponse);
        } catch (error) {
            reply.status(500).send({ error: "Failed to create evaluation" });
        }
    });

    // Update a master penilaian karu by ID
    fastify.put<{
        Params: MasterPenilaianKaruParams;
        Body: MasterPenilaianKaruUpdateRequest;
        Reply: MasterPenilaianKaruResponse | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const updatedEvaluation = await fastify.prisma.masterPenilaianKaru.update({
                where: { id: parseInt(`${id}`) },
                data: request.body,
            });

            return updatedEvaluation as MasterPenilaianKaruResponse;
        } catch (error) {
            reply.status(500).send({ error: "Failed to update evaluation" });
        }
    });

    // Delete a master penilaian karu by ID
    fastify.delete<{
        Params: MasterPenilaianKaruParams;
        Reply: { message: string } | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;

            await fastify.prisma.masterPenilaianKaru.delete({
                where: { id: parseInt(`${id}`) },
            });

            return { message: "Evaluation deleted successfully" };
        } catch (error) {
            reply.status(500).send({ error: "Failed to delete evaluation" });
        }
    });

    // Get active evaluations with status = 1
    fastify.get<{
        Reply: MasterPenilaianKaruActiveResponse[] | ErrorResponse;
    }>('/active', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const activeEvaluations = await fastify.prisma.masterPenilaianKaru.findMany({
                where: {
                    status: 1,
                },
                select: {
                    id: true,
                    kategori: true,
                    penilaian: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                },
            });

            return activeEvaluations as MasterPenilaianKaruActiveResponse[];
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch active evaluations" });
        }
    });
};

export default masterPenilaianKaru;


src/routes/api/penilaian-karu/assesmen/index.ts
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


src/routes/api/pertanyaan/index.ts
import { MasterPertanyaanParams, MasterPertanyaanCreateRequest, MasterPertanyaanUpdateRequest } from 'app-type/request';
import { ErrorResponse, MasterPertanyaanActiveResponse, MasterPertanyaanResponse } from 'app-type/response';
import { FastifyPluginAsync } from 'fastify';

const masterPertanyaan: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

    // Get all master pertanyaan
    fastify.get<{
        Reply: MasterPertanyaanResponse[] | ErrorResponse
    }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const questions = await fastify.prisma.masterPertanyaanAssesmen.findMany();
            return questions as MasterPertanyaanActiveResponse[];
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch questions" });
        }
    });

    // Get a master pertanyaan by ID
    fastify.get<{
        Params: MasterPertanyaanParams;
        Reply: MasterPertanyaanResponse | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const question = await fastify.prisma.masterPertanyaanAssesmen.findUnique({
                where: { id },
            });

            if (!question) {
                reply.status(404).send({ error: "Question not found" });
            } else {
                return question as MasterPertanyaanResponse;
            }
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch question" });
        }
    });

    // Create a new master pertanyaan
    fastify.post<{
        Body: MasterPertanyaanCreateRequest;
        Reply: MasterPertanyaanResponse | ErrorResponse;
    }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const newQuestion = await fastify.prisma.masterPertanyaanAssesmen.create({
                data: request.body,
            });

            reply.status(201).send(newQuestion as MasterPertanyaanResponse);
        } catch (error) {
            reply.status(500).send({ error: "Failed to create question" });
        }
    });

    // Update a master pertanyaan by ID
    fastify.put<{
        Params: MasterPertanyaanParams;
        Body: MasterPertanyaanUpdateRequest;
        Reply: MasterPertanyaanResponse | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;
            const updatedQuestion = await fastify.prisma.masterPertanyaanAssesmen.update({
                where: { id: parseInt(`${id}`) },
                data: request.body,
            });

            return updatedQuestion as MasterPertanyaanResponse;
        } catch (error) {
            console.log(error)
            reply.status(500).send({ error: "Failed to update question" });
        }
    });

    // Delete a master pertanyaan by ID
    fastify.delete<{
        Params: MasterPertanyaanParams;
        Reply: { message: string } | ErrorResponse;
    }>('/by-id/:id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { id } = request.params;

            await fastify.prisma.masterPertanyaanAssesmen.delete({
                where: { id },
            });

            return { message: "Question deleted successfully" };
        } catch (error) {
            reply.status(500).send({ error: "Failed to delete question" });
        }
    });

    // Get active questions with status = 1, excluding vokasi and ners
    fastify.get<{
        Reply: MasterPertanyaanActiveResponse[] | ErrorResponse;
    }>('/active', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const activeQuestions = await fastify.prisma.masterPertanyaanAssesmen.findMany({
                where: {
                    status: 1,
                },
                select: {
                    id: true,
                    skp: true,
                    sub_kategori: true,
                    kode: true,
                    keterampilan: true,
                    tipe: true,
                    priority: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                    // Exclude vokasi and ners
                    vokasi: false,
                    ners: false,
                },
            });

            return activeQuestions as MasterPertanyaanActiveResponse[];
        } catch (error) {
            reply.status(500).send({ error: "Failed to fetch active questions" });
        }
    });
};

export default masterPertanyaan;


src/routes/api/rekomendasi-kainstal/index.ts
import { convertBigIntToFloat } from "../../../utils";
import dayjs from "dayjs";
import { FastifyPluginAsync } from "fastify"
import { groupBy, uniq } from "lodash";

type SKP_type = "SKP1" | "SKP2" | "SKP3" | "SKP4" | "SKP5" | "SKP6"
const rekomendasiKainstal: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Get all rooms
    fastify.get<{
        Querystring: { rsId?: string, karu?: string, status?: string };
    }>('/search',
        // { onRequest: [fastify.authenticate] }, 
        async function (request, reply) {
            try {
                const { karu, rsId } = request.query
                const penilaiankaru = await fastify.prisma.userPenilaianKaru.findMany({
                    where: {
                        ...(rsId && { AkunPerawat: { masterRumahSakitId: rsId } }),  // Only include if rsId exists
                        ...(karu && { Akun: { email: karu } }),                       // Only include if karu exists
                        // ...(status && { status }),                                    // Only include if status exists
                        // userRekomendasiKainstalId: {
                        //     not: null
                        // }
                    },
                    select: {
                        id: true,
                        score: true,
                        created_at: true,
                        updated_at: true,
                        Akun: {
                            select: {
                                email: true,
                                nama: true,
                            }
                        },
                        AkunPerawat: {
                            select: {
                                email: true,
                                nama: true,
                                MasterRuanganRS: true,
                                masterRuanganRSId: true
                            }
                        },
                        UserRekomendasiKainstal: true,
                    },
                });
                return convertBigIntToFloat(penilaiankaru);
            } catch (error) {
                // console.log(error)
                reply.status(500);
                return { error: "Gagal mengambil data ruangan" };
            }
        });

    fastify.get<{
        Params: { id: string }
    }>('/by-id-penilaian/:id',
        // { onRequest: [fastify.authenticate] }, 
        async function (request, reply) {
            try {
                const { id } = request.params
                const penilaiankaru = await fastify.prisma.userPenilaianKaru.findFirst({
                    where: {
                        id: id
                    },
                    include: {
                        Akun: true,
                        AkunPerawat: true,
                    }
                });
                const rekomendasi = await fastify.prisma.userRekomendasiKainstal.findFirst({
                    where: {
                        id_user_penilaian_karu: id
                    },
                });

                const score: Record<SKP_type, number> = {
                    SKP1: 0,
                    SKP2: 0,
                    SKP3: 0,
                    SKP4: 0,
                    SKP5: 0,
                    SKP6: 0,
                }
                const tanggal_asesmen: string[] = []
                if (rekomendasi == null) {
                    let idSoals: string[] = []
                    const asesemen = await fastify.prisma.userAssesmen.findMany({
                        where: {
                            id_penilaian: id,
                        },
                        select: {
                            id_master_pertanyaans: true,
                            jawaban: true,
                            tanggal: true
                        }
                    })
                    const mapScore: Record<number, number> = {}
                    asesemen.forEach(asmn => {
                        idSoals = [...idSoals, ...JSON.parse(asmn.id_master_pertanyaans || "[]")]
                        tanggal_asesmen.push(dayjs(asmn.tanggal).format("YYYY-MM-DD"))
                        asmn.jawaban.forEach((jawaban) => {
                            if (mapScore[jawaban.MasterPertanyaanAssesmenId] != 1) {
                                mapScore[jawaban.MasterPertanyaanAssesmenId] = jawaban.skor
                            }
                        })
                    });
                    // console.log(idSoals)
                    const soals = await fastify.prisma.masterPertanyaanAssesmen.findMany({
                        where: {
                            id: {
                                in: uniq(idSoals).map((v) => parseInt(v as string))
                            }
                        },
                        select: {
                            skp: true,
                            id: true
                        }
                    })
                    const gp = groupBy(soals, "skp")
                    Object.keys(mapScore).forEach((idsoal) => {
                        const skp = soals.find(s => s.id == parseInt(idsoal))?.skp as SKP_type
                        score[skp] = score[skp] + mapScore[parseInt(idsoal)]
                    })

                    Object.keys(gp).forEach((skp) => {
                        const q_perskp = gp[skp].length
                        score[skp as SKP_type] = (score[skp as SKP_type] * 100) / q_perskp
                    })
                } else {
                    const asesemen = await fastify.prisma.userAssesmen.findMany({
                        where: {
                            id_penilaian: id,
                        },
                        select: {
                            id_master_pertanyaans: true,
                            jawaban: true,
                            tanggal: true
                        }
                    })
                    asesemen.forEach(asm => {
                        tanggal_asesmen.push(dayjs(asm.tanggal).format("YYYY-MM-DD"))
                    })
                    score["SKP1"] = rekomendasi.total_scrore_skp1 || 0
                    score["SKP2"] = rekomendasi.total_scrore_skp2 || 0
                    score["SKP3"] = rekomendasi.total_scrore_skp3 || 0
                    score["SKP4"] = rekomendasi.total_scrore_skp4 || 0
                    score["SKP5"] = rekomendasi.total_scrore_skp5 || 0
                    score["SKP6"] = rekomendasi.total_scrore_skp6 || 0
                }
                return {
                    penilaiankaru,
                    rekomendasi: rekomendasi ? { ...convertBigIntToFloat(rekomendasi), submited_at: dayjs(rekomendasi?.submited_at).format("YYYY-MM-DD HH:mm:ss") } : null,
                    score,
                    tanggal_asesmen
                    // totalq
                };
            } catch (error) {
                console.log(error)
                reply.status(500);
                return { error: "Gagal mengambil data ruangan" };
            }
        });


    fastify.post<{
        Body: { penilaianId: string, feedback: string, user: string }
    }>("/submit-feedback", async function (request, reply) {
        try {
            const { penilaianId: id, feedback, user } = request.body



            // const { id } = request.params
            const penilaiankaru = await fastify.prisma.userPenilaianKaru.findFirst({
                where: {
                    id: id
                },
                include: {
                    Akun: true,
                    AkunPerawat: true,
                }
            });

            if (penilaiankaru == null) {
                throw "Penilaian karu tidak ditemukan"
            }
            const rekomendasi = await fastify.prisma.userRekomendasiKainstal.findFirst({
                where: {
                    id_user_penilaian_karu: id
                },
            });

            const score: Record<SKP_type, number> = {
                SKP1: 0,
                SKP2: 0,
                SKP3: 0,
                SKP4: 0,
                SKP5: 0,
                SKP6: 0,
            }
            const tanggal_asesmen: string[] = []
            let message = "Berhasi memberikan feedback";
            if (rekomendasi == null) {
                let idSoals: string[] = []
                const asesemen = await fastify.prisma.userAssesmen.findMany({
                    where: {
                        id_penilaian: id,
                    },
                    select: {
                        id_master_pertanyaans: true,
                        jawaban: true,
                        tanggal: true
                    }
                })
                const mapScore: Record<number, number> = {}
                asesemen.forEach(asmn => {
                    idSoals = [...idSoals, ...JSON.parse(asmn.id_master_pertanyaans || "[]")]
                    tanggal_asesmen.push(dayjs(asmn.tanggal).format("YYYY-MM-DD"))
                    asmn.jawaban.forEach((jawaban) => {
                        if (mapScore[jawaban.MasterPertanyaanAssesmenId] != 1) {
                            mapScore[jawaban.MasterPertanyaanAssesmenId] = jawaban.skor
                        }
                    })
                });
                // console.log(idSoals)
                const soals = await fastify.prisma.masterPertanyaanAssesmen.findMany({
                    where: {
                        id: {
                            in: uniq(idSoals).map((v) => parseInt(v as string))
                        }
                    },
                    select: {
                        skp: true,
                        id: true
                    }
                })
                const gp = groupBy(soals, "skp")
                Object.keys(mapScore).forEach((idsoal) => {
                    const skp = soals.find(s => s.id == parseInt(idsoal))?.skp as SKP_type
                    score[skp] = score[skp] + mapScore[parseInt(idsoal)]
                })

                Object.keys(gp).forEach((skp) => {
                    const q_perskp = gp[skp].length
                    score[skp as SKP_type] = (score[skp as SKP_type] * 100) / q_perskp
                })
                await fastify.prisma.userRekomendasiKainstal.create({
                    data: {
                        total_scrore_skp1: score.SKP1,
                        total_scrore_skp2: score.SKP2,
                        total_scrore_skp3: score.SKP3,
                        total_scrore_skp4: score.SKP4,
                        total_scrore_skp5: score.SKP5,
                        total_scrore_skp6: score.SKP6,
                        feedback_to_karu: feedback,
                        submited_at: dayjs().toDate(),
                        status_approval: "",
                        approved_at: null,
                        id_user_penilaian_karu: penilaiankaru.id,
                        email_user_kainstall: user,
                        idMasterRuanganRS: penilaiankaru.AkunPerawat?.masterRuanganRSId,
                        idMasterRumahSakit: penilaiankaru.AkunPerawat?.masterRumahSakitId
                    }
                })
            } else {
                await fastify.prisma.userRekomendasiKainstal.update({
                    where: {
                        id: rekomendasi?.id
                    },
                    data: {
                        feedback_to_karu: feedback,
                        submited_at: dayjs().toDate()
                    }
                })
            }
            return {
                message
            }
        } catch (error) {
            reply.status(500);
            return { error: "Gagal memberi feedback" };
        }
    })

    fastify.post<{
        Body: { penilaianId: string, feedback: string, user: string }
    }>("/submit-rekomendasi", async function (request, reply) {
        try {
            const { penilaianId: id, feedback: rec, user } = request.body

            // const { id } = request.params
            const penilaiankaru = await fastify.prisma.userPenilaianKaru.findFirst({
                where: {
                    id: id
                },
                include: {
                    Akun: true,
                    AkunPerawat: true,
                }
            });

            if (penilaiankaru == null) {
                throw "Penilaian karu tidak ditemukan"
            }
            const rekomendasi = await fastify.prisma.userRekomendasiKainstal.findFirst({
                where: {
                    id_user_penilaian_karu: id
                },
            });

            if (rekomendasi == null) {
                throw "rekomendasi tidak ditemukan"
            }

            await fastify.prisma.userRekomendasiKainstal.update({
                where: {
                    id: rekomendasi.id,
                },
                data: {
                    approved_at: dayjs().toDate(),
                    status_approval: rec,
                    email_user_kakomwat: user
                }
            })

            return {
                message: "Berhasil memberikan rekomendasi"
            }
        } catch (error) {
            reply.status(500);
            return { error: "Gagal memberi feedback" };
        }
    })

};

export default rekomendasiKainstal;


src/routes/api/rooms/index.ts
import { RoomParams, RoomBody } from "app-type/request";
import { RoomResponse, ErrorResponse } from "app-type/response";
import { FastifyPluginAsync } from "fastify"

const rooms: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    // Get all rooms
    fastify.get<{ Reply: RoomResponse[] | ErrorResponse }>('/all', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const rooms = await fastify.prisma.masterRuanganRS.findMany({
                include: {
                    rumahSakit: true, // To include related hospital data
                },
            });
            return rooms;
        } catch (error) {
            reply.status(500);
            return { error: "Gagal mengambil data ruangan" };
        }
    });

    // Get rooms by hospital ID
    fastify.get<{ Params: { hospital_id: string }; Reply: RoomResponse[] | ErrorResponse }>('/by-hospital/:hospital_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { hospital_id } = request.params;
            const rooms = await fastify.prisma.masterRuanganRS.findMany({
                where: { id_rs: hospital_id },
                include: {
                    rumahSakit: true, // To include related hospital data
                },
            });

            return rooms;
        } catch (error) {
            reply.status(500);
            return { error: "Gagal mengambil data ruangan berdasarkan rumah sakit" };
        }
    });

    // Get a room by ID
    fastify.get<{ Params: RoomParams; Reply: RoomResponse | ErrorResponse }>('/by-id/:room_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { room_id } = request.params;
            const room = await fastify.prisma.masterRuanganRS.findFirst({
                where: { id: room_id },
                include: {
                    rumahSakit: true, // To include related hospital data
                },
            });

            if (!room) {
                reply.status(404);
                return { error: "Ruangan tidak ditemukan" };
            }

            return room;
        } catch (error) {
            reply.status(500);
            return { error: "Gagal mengambil data ruangan" };
        }
    });

    // Create a new room
    fastify.post<{ Body: RoomBody; Reply: RoomResponse | ErrorResponse }>('/', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { nama, id_rs } = request.body;
            const newRoom = await fastify.prisma.masterRuanganRS.create({
                data: {
                    nama,
                    id_rs,
                },
            });

            reply.status(201);
            return newRoom;
        } catch (error) {
            reply.status(500);
            return { error: "Gagal membuat ruangan baru" };
        }
    });

    // Update a room by ID
    fastify.put<{ Params: RoomParams; Body: RoomBody; Reply: RoomResponse | ErrorResponse }>('/by-id/:room_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { room_id } = request.params;
            const { nama, id_rs } = request.body;

            const updatedRoom = await fastify.prisma.masterRuanganRS.update({
                where: { id: room_id },
                data: {
                    nama,
                    id_rs,
                },
            });

            return updatedRoom;
        } catch (error) {
            reply.status(500);
            return { error: "Gagal memperbarui data ruangan" };
        }
    });

    // Delete a room by ID
    fastify.delete<{ Params: RoomParams; Reply: { message: string } | ErrorResponse }>('/by-id/:room_id', { onRequest: [fastify.authenticate] }, async function (request, reply) {
        try {
            const { room_id } = request.params;

            await fastify.prisma.masterRuanganRS.delete({
                where: { id: room_id },
            });

            return { message: "Ruangan berhasil dihapus" };
        } catch (error) {
            reply.status(500);
            return { error: "Gagal menghapus ruangan" };
        }
    });
};

export default rooms;


src/routes/api/user/index.ts
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
                    if (filters.role.includes("karu")) {
                        queryConditions.AND.push({
                            role: {
                                in: [filters.role, "katim"]
                            }
                        });
                    } else {
                        queryConditions.AND.push({
                            role: filters.role,
                        });
                    }

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
