import { z } from 'zod';
import { handbookSchema } from './handbook';

export const appointmentStatus = {
  open: 'OPEN',
  finished: 'FINISHED',
  closed: 'CLOSED',
} as const;

const appointmentStatusValues = Object.values(
  appointmentStatus
) as unknown as readonly [AppointmentStatus, ...AppointmentStatus[]];

export const appointmentSchema = z
  .object({
    id: z.string().optional(),
    status: z.enum(appointmentStatusValues),
    doctorId: z.string(),
    doctorName: z.string(),
    patientId: z.string(),
    patientName: z.string(),
    handbook: handbookSchema,
  })
  .strict();

export type Appointment = z.infer<typeof appointmentSchema>;

export type AppointmentStatus =
  typeof appointmentStatus[keyof typeof appointmentStatus];
