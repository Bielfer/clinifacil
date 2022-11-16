export const roles = {
  master: 'master',
  admin: 'admin',
  doctor: 'doctor',
  receptionist: 'receptionist',
} as const;

const { master, ...allowedCreationRoles } = roles;

export { allowedCreationRoles };
