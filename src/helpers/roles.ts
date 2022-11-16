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

export const temp = [];
