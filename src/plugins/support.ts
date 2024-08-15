import fp from 'fastify-plugin'
import bcrypt from "bcrypt"

export interface SupportPluginOptions {
  // Specify Support plugin options here
}

function hashPassword(password: string): string {
  const saltRounds = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
}

// Fungsi untuk verifikasi password
function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);
  return isMatch;
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.decorate('someSupport', function () {
    return 'hugs'
  })

  fastify.decorate("hashPassword", hashPassword)
  fastify.decorate("verifyPassword", verifyPassword)

})

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    someSupport(): string;
    verifyPassword(plain: string, hash: string): boolean;
    hashPassword(plain: string): string
  }
}
