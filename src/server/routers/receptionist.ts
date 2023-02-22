import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

export const receptionistRouter = router({
  get: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({ id: z.number().optional(), userId: z.string().optional() })
    )
    .query(async ({ input }) => {
      const [receptionist, error] = await tryCatch(
        prisma.receptionist.findUnique({
          where: input,
          include: {
            doctors: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return receptionist;
    }),
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        name: z.string(),
        doctorId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const [receptionist, error] = await tryCatch(
        prisma.receptionist.create({
          data: {
            name: input.name,
            doctors: {
              connect: [{ id: input.doctorId }],
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return receptionist;
    }),
});

export type ReceptionistRouter = typeof receptionistRouter;
