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
