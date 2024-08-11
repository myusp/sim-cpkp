import fp from 'fastify-plugin';
import cors from '@fastify/cors';


/**
 * This plugin serves static files from the React build directory
 *
 * @see https://github.com/fastify/fastify-cors
 */
export default fp(async (fastify) => {
    fastify.register(cors, {
        origin: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    })
});
