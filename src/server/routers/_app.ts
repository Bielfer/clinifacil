import { publicProcedure, router } from '../trpc';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
});

export type AppRouter = typeof appRouter;
