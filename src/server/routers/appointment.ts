import {
  appointmentStatus,
  appointmentStatusValues,
} from '@/constants/appointment-status';
import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole, isAuthorized } from '../middlewares';
import { handbookFieldSchema } from './handbook';

const appointmentReturnFormat = {
  doctor: {
    select: {
      name: true,
      id: true,
    },
  },
  patient: true,
  handbook: {
    include: {
      fields: {
        include: {
          options: true,
        },
      },
    },
  },
};

export const appointmentRouter = router({
  get: privateProcedure
    .use(isAuthorized({ inputKey: 'doctorId' }))
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ input }) => {
      const [appointment, error] = await tryCatch(
        prisma.appointment.findUnique({
          where: {
            id: input.id,
          },
          include: appointmentReturnFormat,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointment;
    }),
  getMany: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        doctorId: z.number().optional(),
        patientId: z.number().optional(),
        status: z
          .enum(appointmentStatusValues)
          .or(z.enum(appointmentStatusValues).array())
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const { status: inputStatus, ...inputWithoutStatus } = input;
      const statusOrList = Array.isArray(input.status)
        ? input.status?.map((status) => ({ status: { equals: status } }))
        : [{ status: { equals: input.status } }];

      const [appointments, error] = await tryCatch(
        prisma.appointment.findMany({
          where: {
            ...inputWithoutStatus,
            OR: statusOrList,
          },
          include: appointmentReturnFormat,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointments;
    }),
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        doctorId: z.number(),
        patientId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { doctorId, patientId } = input;

      const [appointment, error] = await tryCatch(
        prisma.appointment.create({
          data: {
            status: appointmentStatus.open,
            doctor: {
              connect: {
                id: doctorId,
              },
            },
            patient: {
              connect: {
                id: patientId,
              },
            },
          },
          include: appointmentReturnFormat,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointment;
    }),
  update: privateProcedure
    .use(isAuthorized({ inputKey: 'userId' }))
    .input(
      z.object({
        userId: z.string(),
        id: z.number(),
        status: z.enum(appointmentStatusValues).optional(),
        handbook: z.object({
          title: z.string(),
          fields: handbookFieldSchema
            .extend({
              id: z.number().optional(),
            })
            .array(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const { id, status, handbook } = input;

      const [appointmentData, error] = await tryCatch(
        prisma.$transaction(async (transaction) => {
          const appointment = await transaction.appointment.findUnique({
            where: {
              id,
            },
            select: {
              status: true,
              handbook: true,
            },
          });

          if (!appointment) throw new Error('Appointment not found');

          if (appointment.status === 'CLOSED')
            throw new Error('Appointment already closed');

          if (!appointment.handbook) {
            const createdHandbook = await transaction.appointment.update({
              where: { id },
              data: {
                status,
                handbook: {
                  create: {
                    ...handbook,
                    fields: {
                      create: handbook.fields.map((field) => ({
                        ...field,
                        options: { create: field.options },
                      })),
                    },
                  },
                },
              },
              include: appointmentReturnFormat,
            });

            return createdHandbook;
          }

          const updatedHandbook = await transaction.appointment.update({
            where: { id },
            data: {
              status,
              handbook: {
                update: {
                  fields: {
                    update: handbook.fields.map((field) => ({
                      where: {
                        id: field.id,
                      },
                      data: {
                        value: field.value,
                      },
                    })),
                  },
                },
              },
            },
            include: appointmentReturnFormat,
          });

          return updatedHandbook;
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointmentData;
    }),
});

export type AppointmentRouter = typeof appointmentRouter;
