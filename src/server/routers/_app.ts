import { publicProcedure, router } from '@/server/trpc';
import { appointmentRouter } from './appointment';
import { doctorRouter } from './doctor';
import { doctorNotesRouter } from './doctor-note';
import { handbookRouter } from './handbook';
import { patientRouter } from './patient';
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
  doctorNote: doctorNotesRouter,
});

export type AppRouter = typeof appRouter;
