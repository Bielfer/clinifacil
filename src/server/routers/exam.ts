import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const examRouter = router({
  getMany: privateProcedure
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { patientId, doctorId } = input;

      const [exams, error] = await tryCatch(
        prisma.exam.findMany({
          where: {
            appointment: {
              patientId,
              doctorId,
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return exams;
    }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        appointmentId: z.number(),
        doctorId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { appointmentId, doctorId, ...filteredInput } = input;

      const [exam, error] = await tryCatch(
        prisma.exam.create({
          data: {
            ...filteredInput,
            ...(doctorId && {
              doctor: {
                connect: {
                  id: doctorId,
                },
              },
            }),
            appointment: {
              connect: {
                id: appointmentId,
              },
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return exam;
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      const [exam, error] = await tryCatch(
        prisma.exam.delete({
          where: {
            id,
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return exam;
    }),
});

export type ExamRouter = typeof examRouter;
