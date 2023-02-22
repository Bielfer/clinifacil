import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const prescriptionRouter = router({
  getMany: privateProcedure
    .input(
      z.object({
        appointmentId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { appointmentId } = input;

      const [prescriptions, error] = await tryCatch(
        prisma.prescription.findMany({
          where: {
            appointment: {
              id: appointmentId,
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return prescriptions;
    }),
  create: privateProcedure
    .input(
      z.object({
        medicationName: z.string(),
        boxAmount: z.number(),
        instructions: z.string(),
        appointmentId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { appointmentId, ...filteredInput } = input;

      const [prescription, error] = await tryCatch(
        prisma.prescription.create({
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

      return prescription;
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      const [prescription, error] = await tryCatch(
        prisma.prescription.delete({
          where: {
            id,
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return prescription;
    }),
});

export type PrescriptionRouter = typeof prescriptionRouter;
