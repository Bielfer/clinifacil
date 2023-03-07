import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import type { Exam, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

export const examRouter = router({
  getMany: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number().optional(),
        appointmentId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId, appointmentId } = input;

      const [exams, error] = await tryCatch(
        prisma.exam.findMany({
          where: {
            ...(doctorId && { doctorId }),
            ...(appointmentId
              ? {
                  appointment: {
                    id: appointmentId,
                  },
                }
              : { appointment: null }),
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return exams;
    }),
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.union([
        z.object({
          name: z.string(),
          appointmentId: z.number(),
          doctorId: z.number().optional(),
        }),
        z
          .object({
            name: z.string(),
            appointmentId: z.number().optional(),
            doctorId: z.number().optional(),
          })
          .array(),
      ])
    )
    .mutation(async ({ input }) => {
      const formatExam = (exam: {
        name: string;
        appointmentId?: number;
        doctorId?: number;
      }) => {
        const { name, appointmentId, doctorId } = exam;
        return {
          name,
          ...(doctorId && {
            doctor: {
              connect: {
                id: doctorId,
              },
            },
          }),
          ...(appointmentId && {
            appointment: {
              connect: {
                id: appointmentId,
              },
            },
          }),
        };
      };

      const writeData = Array.isArray(input)
        ? input.map((exam) => formatExam(exam))
        : [formatExam(input)];

      const toCreateExams: Prisma.Prisma__ExamClient<Exam, never>[] = [];

      writeData.forEach(async (exam) => {
        const toCreateExam = prisma.exam.create({
          data: exam,
        });

        toCreateExams.push(toCreateExam);
      });

      const [exams, error] = await tryCatch(prisma.$transaction(toCreateExams));

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return exams;
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
