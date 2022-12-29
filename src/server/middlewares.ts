import { roles } from '@/constants/roles';
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

export const isAuthorized = ({
  inputKey,
  allowedRole,
}: {
  inputKey: string;
  allowedRole?: Role;
}) =>
  middleware(async ({ ctx, next, rawInput }) => {
    const role = ctx.session?.user.role;
    const id = ctx.session?.user.id;

    const inputId = (rawInput as any)[inputKey];

    if (
      id !== inputId &&
      !isHigherOrEqualInRoleHierarchy(role, allowedRole ?? roles.master)
    )
      throw new TRPCError({ code: 'FORBIDDEN' });

    return next();
  });
