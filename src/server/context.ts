import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@/services/prisma';
import { getServerAuthSession } from '@/helpers/trpc';
import { ExtendedSession } from '@/types/auth';

type CreateContextOptions = {
  session: ExtendedSession | null;
};

export const createContextInner = async (opts: CreateContextOptions) => ({
  session: opts.session,
  prisma,
});

export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return createContextInner({
    session,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
