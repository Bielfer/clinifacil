import { bucketFolders } from '@/constants/aws';
import { examTypeValues } from '@/constants/exams';
import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { createPresignedUrlWithClient } from '@/services/aws';
import { prisma } from '@/services/prisma';
import type { Exam, ExamType, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

const examSchema = z.object({
  name: z.string(),
  appointmentId: z.number(),
  doctorId: z.number().optional(),
  imageUrl: z.string().optional(),
  type: z.enum(examTypeValues).optional(),
});

export const examRouter = router({
  getMany: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number().optional(),
        appointmentId: z.number().optional(),
        type: z.enum(examTypeValues).optional(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId, appointmentId, type = 'REGULAR' } = input;

      const [exams, error] = await tryCatch(
        prisma.exam.findMany({
          where: {
            ...(doctorId && { doctorId }),
            type,
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
    .input(z.union([examSchema, examSchema.array()]))
    .mutation(async ({ input }) => {
      const formatExam = (exam: {
        name: string;
        appointmentId?: number;
        doctorId?: number;
        imageUrl?: string;
        type?: ExamType;
      }) => {
        const {
          name,
          appointmentId,
          doctorId,
          imageUrl,
          type = 'REGULAR',
        } = exam;
        return {
          name,
          type,
          ...(imageUrl && { imageUrl }),
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
  getPresignedUrl: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .query(async () => {
      const presignedUrl = await createPresignedUrlWithClient(
        bucketFolders.imageExams
      );

      return presignedUrl;
    }),
});

export type ExamRouter = typeof examRouter;
