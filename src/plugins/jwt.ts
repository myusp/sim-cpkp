import fp from 'fastify-plugin';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { JwtPayload } from 'app-type/index';

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

    fastify.decorate("authdata", async function (request: FastifyRequest, reply: FastifyReply): Promise<JwtPayload | null> {
        try {
            // const token = request.headers.authorization?.split("bearer ")[1]
            const data = await request.jwtDecode()
            console.log(data)
            return null
        } catch (err) {
            return null
        }
    });
});

declare module 'fastify' {
    export interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        authdata: (request: FastifyRequest, reply: FastifyReply) => Promise<JwtPayload | null>
    }
}
