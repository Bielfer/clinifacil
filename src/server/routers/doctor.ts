import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole, isAuthorized } from '../middlewares';

export const doctorRouter = router({
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.admin))
    .input(
      z.object({
        name: z.string(),
        cpf: z.string(),
        crm: z.string(),
        email: z.string().optional(),
        cellphone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [doctor, error] = await tryCatch(
        prisma.doctor.create({
          data: input,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return doctor;
    }),
  edit: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .use(isAuthorized({ inputKey: 'id' }))
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        cellphone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...inputWithoutId } = input;
      const [doctor, error] = await tryCatch(
        prisma.doctor.update({
          where: {
            id,
          },
          data: inputWithoutId,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return doctor;
    }),
});

export type DoctorRouter = typeof doctorRouter;
