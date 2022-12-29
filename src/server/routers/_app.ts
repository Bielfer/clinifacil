import { publicProcedure, router } from '@/server/trpc';
import { roleRouter } from './role';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  role: roleRouter,
});

export type AppRouter = typeof appRouter;
