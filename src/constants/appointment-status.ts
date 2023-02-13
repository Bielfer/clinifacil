import type { AppointmentStatus } from '@prisma/client';

export const appointmentStatus = {
  open: 'OPEN',
  finished: 'FINISHED',
  archived: 'ARCHIVED',
} as const;

export const appointmentStatusValues = Object.values(
  appointmentStatus
) as unknown as readonly [AppointmentStatus, ...AppointmentStatus[]];
