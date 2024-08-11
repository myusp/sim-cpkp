import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    reply.redirect("/app")
    // return { root: true, "time": dayjs() }
  })
}

export default root;
