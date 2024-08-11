export type JwtPayload = {
    email: string
    name: string
    role: string
    id_rs: string | null
    id_ruangan: string | null

    created: number
}