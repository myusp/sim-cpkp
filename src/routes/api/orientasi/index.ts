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
