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

const appointmentReturnFormat = {
  doctor: {
    select: {
      name: true,
      id: true,
    },
  },
  patient: true,
  handbooks: {
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
            ...(inputStatus && { OR: statusOrList }),
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
        appointmentTypeId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { doctorId, patientId, appointmentTypeId } = input;

      const [appointmentType, appointmentTypeError] = await tryCatch(
        prisma.appointmentType.findUnique({
          where: { id: appointmentTypeId },
          select: { price: true, name: true },
        })
      );

      if (appointmentTypeError || !appointmentType)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: appointmentTypeError ?? 'No appointment type was found!',
        });

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
            type: {
              create: appointmentType,
            },
          },
          include: appointmentReturnFormat,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointment;
    }),
  update: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(
      z.object({
        id: z.number(),
        status: z.enum(appointmentStatusValues).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...filteredInput } = input;

      const [appointmentData, error] = await tryCatch(
        prisma.$transaction(async (transaction) => {
          const appointment = await transaction.appointment.findUnique({
            where: {
              id,
            },
            select: {
              status: true,
            },
          });

          if (!appointment) throw new Error('Appointment not found');

          if (appointment.status === appointmentStatus.archived)
            throw new Error('Appointment already archived');

          const updatedAppointment = await transaction.appointment.update({
            where: { id },
            data: filteredInput,
            include: appointmentReturnFormat,
          });

          return updatedAppointment;
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return appointmentData;
    }),
});

export type AppointmentRouter = typeof appointmentRouter;
