import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import { FastifyInstance } from 'fastify';

export interface PrismaPluginOptions {
    // Specify Prisma plugin options here, if any
}

// Plugin untuk mengintegrasikan Prisma ke dalam Fastify
export default fp<PrismaPluginOptions>((fastify: FastifyInstance, opts: PrismaPluginOptions, done: () => void) => {
    const prisma = new PrismaClient({
        transactionOptions: {
            timeout: 1000 * 60
        }
    });

    // Dekorasi instance Fastify dengan Prisma Client
    fastify.decorate('prisma', prisma);

    // Hook untuk memastikan koneksi Prisma ditutup saat Fastify berhenti
    fastify.addHook('onClose', (fastifyInstance, done) => {
        fastifyInstance.prisma.$disconnect()
            .then(() => done())
            .catch(done);
    });

    done(); // Menyelesaikan registrasi plugin secara sinkron
});

// Deklarasi module augmentation untuk menambahkan properti `prisma` ke FastifyInstance
declare module 'fastify' {
    export interface FastifyInstance {
        prisma: PrismaClient;
    }
}
