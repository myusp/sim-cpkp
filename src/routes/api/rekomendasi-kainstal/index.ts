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
