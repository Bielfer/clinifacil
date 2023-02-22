import { publicProcedure, router } from '@/server/trpc';
import { appointmentRouter } from './appointment';
import { detailedAppointmentRouter } from './detailed-appointment';
import { doctorRouter } from './doctor';
import { doctorNotesRouter } from './doctor-note';
import { examRouter } from './exam';
import { handbookRouter } from './handbook';
import { patientRouter } from './patient';
import { prescriptionRouter } from './prescription';
import { receptionistRouter } from './receptionist';
import { roleRouter } from './role';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  role: roleRouter,
  patient: patientRouter,
  receptionist: receptionistRouter,
  doctor: doctorRouter,
  handbook: handbookRouter,
  appointment: appointmentRouter,
  detailedAppointment: detailedAppointmentRouter,
  doctorNote: doctorNotesRouter,
  prescription: prescriptionRouter,
  exam: examRouter,
});

export type AppRouter = typeof appRouter;
