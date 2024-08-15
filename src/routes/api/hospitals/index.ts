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
