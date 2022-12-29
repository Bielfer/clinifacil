export const roles = {
  master: 'MASTER',
  admin: 'ADMIN',
  doctor: 'DOCTOR',
  receptionist: 'RECEPTIONIST',
} as const;

const { master, ...allowedCreationRoles } = roles;

export { allowedCreationRoles };
