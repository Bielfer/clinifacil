import { appointmentStatusValues } from '@/constants/appointment-status';
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
  type: true,
  doctorNotes: true,
  exams: true,
  prescriptions: true,
};

export const detailedAppointmentRouter = router({
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
          .record(z.enum(['createdAt']), z.enum(['asc', 'desc']))
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
});

export type DetailedAppointmentRouter = typeof detailedAppointmentRouter;
