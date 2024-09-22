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
