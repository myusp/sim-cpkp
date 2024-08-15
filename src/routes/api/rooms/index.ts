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
