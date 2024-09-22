import { join } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify';
import fastifyCron from 'fastify-cron'; // Import fastify-cron
import dayjs from 'dayjs';

export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })

  void fastify.register(fastifyCron, {
    jobs: [
      {
        cronTime: '0 18 * * *', // Example: Runs every day at midnight
        onTick: async (server) => {
          const { prisma } = fastify
          // Define your cron task logic here
          fastify.log.info('Cron job running at midnight');
          const today = dayjs()
          const allPerawatNotFillSelfAssesmen = await prisma.akun.findMany({
            where: {
              role: "perawat",
              UserAssesmen: {
                none: {
                  tanggal: today.toDate()
                }
              }
            }
          })

          // insert notif
          await prisma.notificationKaruToPerawat.createMany({
            data: allPerawatNotFillSelfAssesmen.map(u => {
              return {
                fromKaruEmail: "sistem",
                toPerawatEmail: u.email,
                message: "Pengingat ! Anda belum mengisi self asesmen tanggal " + today.format("YYYY-MM-DD"),
                selfAsesmenDate: today.toDate()
              }
            })
          })
          // You can also interact with your database or services here
        },
        start: true, // Start the cron job immediately
      },
    ],
  });
};

export default app;
export { app, options }
