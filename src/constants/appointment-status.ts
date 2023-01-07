import { AppointmentStatus } from '@prisma/client';

export const appointmentStatus = {
  open: 'OPEN',
  finished: 'FINISHED',
  closed: 'CLOSED',
} as const;

export const appointmentStatusValues = Object.values(
  appointmentStatus
) as unknown as readonly [AppointmentStatus, ...AppointmentStatus[]];
