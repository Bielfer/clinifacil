import { isHigherOrEqualInRoleHierarchy } from '@/helpers/roles';
import { Role } from '@/types/role';
import { TRPCError } from '@trpc/server';
import { middleware } from './trpc';

export const authorizeHigherOrEqualRole = (roleToCompare: Role) =>
  middleware(async ({ ctx, next }) => {
    const role = ctx.session?.user.role;

    if (!role || !isHigherOrEqualInRoleHierarchy(role, roleToCompare)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next();
  });

export const temp = '';
