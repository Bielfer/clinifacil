import {
  appointmentStatus,
  appointmentStatusValues,
} from '@/constants/appointment-status';
import { roles } from '@/constants/roles';
import {
  timeIntervalDates,
  timeIntervalValues,
} from '@/constants/time-intervals';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

const appointmentReturnFormat = {
  patient: true,
  type: true,
};

const getActiveAppointment = async ({
  doctorId,
  patientId,
}: {
  doctorId: number;
  patientId: number;
}) => {
  const [appointments, error] = await tryCatch(
    prisma.appointment.findMany({
      where: {
        doctorId,
        patientId,
        status: {
          in: [appointmentStatus.open, appointmentStatus.finished],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      include: {
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
      },
    })
  );

  if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

  const hasActiveAppointment = appointments && appointments.length > 0;

  return hasActiveAppointment ? appointments[0] : null;
};

export const appointmentRouter = router({
  active: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        patientId: z.number(),
        doctorId: z.number(),
      })
    )
    .query(({ input }) => getActiveAppointment(input)),
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
        interval: z.enum(timeIntervalValues).optional(),
        typeName: z.string().optional(),
        orderBy: z
          .record(
            z.enum(['createdAt', 'displayOrder']),
            z.enum(['asc', 'desc'])
          )
          .optional(),
      })
    )
    .query(async ({ input }) => {
      const {
        status: inputStatus,
        orderBy = { createdAt: 'asc' },
        interval,
        typeName,
        ...inputWithoutStatus
      } = input;
      const statusOrList = Array.isArray(input.status)
        ? input.status?.map((status) => ({ status: { equals: status } }))
        : [{ status: { equals: input.status } }];

      const [appointments, error] = await tryCatch(
        prisma.appointment.findMany({
          where: {
            ...inputWithoutStatus,
            ...(inputStatus && { OR: statusOrList }),
            ...(interval && {
              createdAt: {
                gte: timeIntervalDates[interval].gte,
                lte: timeIntervalDates[interval].lte,
              },
            }),
            ...(typeName && { type: { name: typeName } }),
          },
          orderBy,
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
        status: z.enum(appointmentStatusValues).optional(),
        realizationDate: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        doctorId,
        patientId,
        realizationDate,
        appointmentTypeId,
        status,
      } = input;

      const activeAppointment = await getActiveAppointment({
        doctorId,
        patientId,
      });

      const [lastAppointmentInQueue, errorLastAppointmentInQueue] =
        await tryCatch(
          prisma.appointment.findMany({
            where: {
              status: appointmentStatus.open,
              doctorId,
            },
            orderBy: {
              displayOrder: 'desc',
            },
            take: 1,
          })
        );

      if (errorLastAppointmentInQueue)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: errorLastAppointmentInQueue,
        });

      if (activeAppointment) {
        const [updatedAppointment, error] = await tryCatch(
          prisma.appointment.update({
            where: { id: activeAppointment.id },
            data: {
              status: appointmentStatus.open,
              displayOrder:
                (lastAppointmentInQueue?.[0]?.displayOrder ?? 0) + 1,
            },
          })
        );

        if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

        return updatedAppointment;
      }

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
            status: status ?? appointmentStatus.open,
            displayOrder: (lastAppointmentInQueue?.[0]?.displayOrder ?? 0) + 1,
            ...(realizationDate && { realizationDate }),
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
  summary: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(
      z.object({
        doctorId: z.number(),
        interval: z.enum(timeIntervalValues).optional(),
      })
    )
    .query(async ({ input }) => {
      const { doctorId, interval = 'TODAY' } = input;

      const [appointmentTypes, error] = await tryCatch(
        prisma.appointmentType.groupBy({
          by: ['name'],
          where: {
            createdAt: {
              gte: timeIntervalDates[interval].gte,
              lte: timeIntervalDates[interval].lte,
            },
            appointment: {
              status: {
                in: [appointmentStatus.finished, appointmentStatus.archived],
              },
              doctorId,
            },
          },
          _sum: {
            price: true,
          },
          orderBy: {
            name: 'asc',
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      const total = appointmentTypes?.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue._sum?.price ?? 0),
        0
      );

      return { appointmentTypes, total };
    }),
});

export type AppointmentRouter = typeof appointmentRouter;
