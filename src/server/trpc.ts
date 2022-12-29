/* eslint no-console:off */
import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const t = initTRPC.context<Context>().create();

export const { router, middleware } = t;

const logger = middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;

  if (result.ok) console.log('OK request timing:', { path, type, durationMs });
  else console.error('Error request timing', { path, type, durationMs });

  return result;
});

const isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const publicProcedure = t.procedure.use(logger);

export const privateProcedure = t.procedure.use(logger).use(isAuthenticated);
