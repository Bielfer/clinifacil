import { roles } from '@/constants/roles';
import { isHigherOrEqualInRoleHierarchy } from '@/helpers/roles';
import { Role } from '@/types/role';
import { TRPCError } from '@trpc/server';
import { middleware } from './trpc';

export const authorizeHigherOrEqualRole = (roleToCompare: Role) =>
  middleware(async ({ ctx, next }) => {
    const role = ctx.session?.role;
    const lowestRole = Object.values(roles)[Object.values(roles).length - 1];

    if (!isHigherOrEqualInRoleHierarchy(role ?? lowestRole, roleToCompare)) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }

    return next();
  });

export const temp = {};
