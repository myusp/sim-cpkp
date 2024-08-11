import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

/**
 * This plugin serves static files from the React build directory
 *
 * @see https://github.com/fastify/fastify-static
 */
export default fp(async (fastify) => {
    fastify.register(fastifyStatic, {
        root: join(__dirname, '..', 'web'), // Path to the React build directory
        prefix: '/app', // Serve files at the root URL path
        // extensions: ["js", "css", "html", "svg"]
        maxAge: 60 * 60 * 24 * 1000
    });

    // Serve index.html for any unmatched routes (for client-side routing in React)
    fastify.setNotFoundHandler((request, reply) => {
        reply.sendFile('index.html'); // Make sure index.html exists in the dist directory
    });
});
