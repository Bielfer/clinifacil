import { publicProcedure, router } from '@/server/trpc';
import { doctorRouter } from './doctor';
import { patientRouter } from './patient';
import { receptionistRouter } from './receptionist';
import { roleRouter } from './role';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  role: roleRouter,
  patient: patientRouter,
  receptionist: receptionistRouter,
  doctor: doctorRouter,
});

export type AppRouter = typeof appRouter;
