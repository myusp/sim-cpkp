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
