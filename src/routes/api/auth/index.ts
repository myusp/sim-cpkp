import { FastifyPluginAsync } from "fastify"
import dayjs from "dayjs"
import { LoginRequest } from "app-type/request"
import { LoginResponse } from "app-type/response"
import { JwtPayload } from "app-type/index"

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    const { verifyPassword } = fastify

    fastify.post('/login', async function (request, reply) {
        const { email, password } = request.body as LoginRequest

        const akun = await fastify.prisma.akun.findFirst({
            where: {
                email
            }
        })
        if (!akun) {
            return reply.send({
                message: "email atau password salah"
            })
        }
        if (!verifyPassword(password || "", akun.password)) {
            return reply.send({
                message: "email atau password salah"
            })
        }
        const pld: JwtPayload = {
            email: akun.email,
            created: dayjs().unix(),
            name: akun.nama,
            role: akun.role,
            id_rs: akun.masterRumahSakitId,
            id_ruangan: akun.masterRuanganRSId
        }
        await fastify.prisma.akun.update({
            where: { email: email },
            data: {
                last_login: dayjs().toDate()
            }
        })
        return reply.send({
            token: fastify.jwt.sign(pld)
        } as LoginResponse)

    })

}

export default auth;
