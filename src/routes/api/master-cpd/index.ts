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
