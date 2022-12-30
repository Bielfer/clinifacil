import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole, isAuthorized } from '../middlewares';

export const receptionistRouter = router({
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .use(isAuthorized({ inputKey: 'doctorId' }))
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
