import { prisma } from '@/db';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { roleSchema } from '@/types/role';
import { TRPCError } from '@trpc/server';

export const roleRouter = router({
  edit: privateProcedure.input(roleSchema).mutation(async ({ input }) => {
    const { id, role } = input;

    const [editRole, error] = await tryCatch(
      prisma.user.update({
        where: {
          id,
        },
        data: {
          role,
        },
      })
    );

    if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

    return editRole;
  }),
});

export type RoleRouter = typeof roleRouter;
