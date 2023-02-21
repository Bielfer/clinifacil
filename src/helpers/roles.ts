import { roles } from '@/constants/roles';
import { Role } from '@/types/role';

export const isHigherInRoleHierarchy = (role: Role, toCompare: Role) => {
  const roleIndex = Object.values(roles).findIndex((item) => item === role);
  const toCompareIndex = Object.values(roles).findIndex(
    (item) => item === toCompare
  );

  if (roleIndex < toCompareIndex) return true;

  return false;
};

export const isHigherOrEqualInRoleHierarchy = (
  toCompareRole: Role,
  baselineRole: Role
) => {
  const toCompareRoleIndex = Object.values(roles).findIndex(
    (item) => item === toCompareRole
  );
  const baselineRoleIndex = Object.values(roles).findIndex(
    (item) => item === baselineRole
  );

  if (toCompareRoleIndex <= baselineRoleIndex) return true;

  return false;
};
