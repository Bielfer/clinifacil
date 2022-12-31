export const appointmentStatus = {
  open: 'OPEN',
  finished: 'FINISHED',
  closed: 'CLOSED',
} as const;

export const appointmentStatusValues = Object.values(
  appointmentStatus
) as unknown as readonly [AppointmentStatus, ...AppointmentStatus[]];

export type AppointmentStatus =
  typeof appointmentStatus[keyof typeof appointmentStatus];
