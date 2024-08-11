import { FastifyPluginAsync } from "fastify"

const api: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', async function (request, reply) {
        return { name: "api service", version: "1.0.0" }
    })
}

export default api;
