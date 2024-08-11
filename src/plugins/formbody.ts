import fp from 'fastify-plugin';
import formbody from "@fastify/formbody"


/**
 * This plugin serves static files from the React build directory
 *
 * @see https://github.com/fastify/fastify-form-body
 */
export default fp(async (fastify) => {
    fastify.register(formbody)
});
