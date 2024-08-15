import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';

/**
 * This plugin serves static files from the React build directory
 *
 * @see https://github.com/fastify/fastify-jwt
 */
export default fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJwt, {
        secret: "supersecret",
        sign: {
            expiresIn: "3d"
        }
    });

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

});

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
