import { allowedCreationRoles, roles } from '@/constants/roles';
import { prisma } from '@/services/prisma';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole } from '../middlewares';

const allowedCreationRolesValues = Object.values(
  allowedCreationRoles
) as unknown as readonly [AllowedCreationRoles, ...AllowedCreationRoles[]];

export type Role = typeof roles[keyof typeof roles];

export type AllowedCreationRoles =
  typeof allowedCreationRoles[keyof typeof allowedCreationRoles];

export const roleRouter = router({
  edit: privateProcedure
    .input(
      z.object({
        id: z.string(),
        role: z.enum(allowedCreationRolesValues),
      })
    )
    .use(authorizeHigherOrEqualRole(roles.admin))
    .mutation(async ({ input }) => {
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
