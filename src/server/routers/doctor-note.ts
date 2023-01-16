import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

export const doctorNotesRouter = router({
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        appointmentId: z.number(),
        duration: z.number(),
        startDate: z.date(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { appointmentId, ...filteredInput } = input;

      const [doctorNote, error] = await tryCatch(
        prisma.doctorNote.create({
          data: {
            ...filteredInput,
            appointment: {
              connect: {
                id: appointmentId,
              },
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return doctorNote;
    }),
  delete: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const [deletedDoctorNote, error] = await tryCatch(
        prisma.doctorNote.delete({
          where: {
            id,
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return deletedDoctorNote;
    }),
});

export type DoctorNotesRouter = typeof doctorNotesRouter;
