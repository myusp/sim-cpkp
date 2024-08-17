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
