import { publicProcedure, router } from '@/server/trpc';
import { patientRouter } from './patient';
import { roleRouter } from './role';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  role: roleRouter,
  patient: patientRouter,
});

export type AppRouter = typeof appRouter;
