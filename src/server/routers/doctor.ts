import { printableTypesValues } from '@/constants/printables';
import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

export const doctorRouter = router({
  get: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({ id: z.number().optional(), userId: z.string().optional() })
    )
    .query(async ({ input }) => {
      const [doctor, error] = await tryCatch(
        prisma.doctor.findUnique({
          where: input,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return doctor;
    }),
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.admin))
    .input(
      z.object({
        name: z.string(),
        cpf: z.string(),
        crm: z.string(),
        city: z.string(),
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
  handbooks: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number().optional(),
        userId: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId } = input;

      const [handbooks, error] = await tryCatch(
        prisma.handbook.findMany({
          where: {
            doctors: {
              some: {
                id: doctorId,
              },
            },
          },
          include: {
            fields: {
              include: { options: true },
              orderBy: {
                displayOrder: 'asc',
              },
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return handbooks;
    }),
  putHandbook: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number(),
        handbookId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { doctorId, handbookId } = input;

      const [doctor, error] = await tryCatch(
        prisma.doctor.update({
          where: {
            id: doctorId,
          },
          data: {
            handbooks: {
              connect: {
                id: handbookId,
              },
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return doctor;
    }),
  medications: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId } = input;

      const [medications, error] = await tryCatch(
        prisma.medication.findMany({
          where: {
            doctorId,
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return medications;
    }),
  appointmentTypes: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId } = input;

      const [appointmentTypes, error] = await tryCatch(
        prisma.appointmentType.findMany({
          where: {
            doctorId,
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointmentTypes;
    }),
  printables: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        doctorId: z.number(),
        type: z.enum(printableTypesValues).optional(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId, type } = input;

      const [prescriptions, error] = await tryCatch(
        prisma.printable.findMany({
          where: {
            doctorId,
            ...(type && { type }),
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return prescriptions;
    }),
});

export type DoctorRouter = typeof doctorRouter;
