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
