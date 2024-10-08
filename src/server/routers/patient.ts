import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

export const patientRouter = router({
  get: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        cpf: z.string().optional(),
        id: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const [patient, error] = await tryCatch(
        prisma.patient.findUnique({
          where: input,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return patient;
    }),
  getMany: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        search: z.string().trim(),
      })
    )
    .query(async ({ input }) => {
      const search = input.search
        .split(' ')
        .map((searchPart) => `+*${searchPart}*`)
        .join(' ');

      const [patients, error] = await tryCatch(
        prisma.patient.findMany({
          where: {
            cpf: {
              search,
            },
            name: { search },
          },
          take: 5,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return patients;
    }),
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        name: z.string(),
        birthDate: z.date().optional(),
        sex: z.enum(['Masculino', 'Feminino']).optional(),
        cpf: z.string().optional(),
        email: z.string().email().optional(),
        cellphone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [searchedPatient, errorSearching] = await tryCatch(
        prisma.patient.findUnique({
          where: {
            cpf: input.cpf,
          },
        })
      );

      if (errorSearching)
        throw new TRPCError({ code: 'BAD_REQUEST', message: errorSearching });

      if (searchedPatient) return searchedPatient;

      const [patient, error] = await tryCatch(
        prisma.patient.create({
          data: input,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return patient;
    }),
  getById: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [patient, error] = await tryCatch(
        prisma.patient.findUnique({
          where: {
            id: input.id,
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return patient;
    }),
  editById: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        id: z.number(),
        email: z.string().email().optional(),
        cellphone: z.string().max(11).min(10).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...inputWithoutId } = input;

      const [patient, error] = await tryCatch(
        prisma.patient.update({
          where: { id },
          data: inputWithoutId,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return patient;
    }),
});

export type PatientRouter = typeof patientRouter;
