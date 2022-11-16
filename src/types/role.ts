import { roles, allowedCreationRoles } from '@/constants/roles';
import { z } from 'zod';

const allowedCreationRolesValues = Object.values(
  allowedCreationRoles
) as unknown as readonly [AllowedCreationRoles, ...AllowedCreationRoles[]];

export const roleSchema = z
  .object({
    uid: z.string(),
    role: z.enum(allowedCreationRolesValues),
  })
  .strict();

export type Role = typeof roles[keyof typeof roles];

export type AllowedCreationRoles =
  typeof allowedCreationRoles[keyof typeof allowedCreationRoles];
