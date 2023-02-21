import { roles } from '@/constants/roles';
import { isHigherOrEqualInRoleHierarchy } from '@/helpers/roles';
import { useSession } from 'next-auth/react';

const useRoles = () => {
  const { data: session } = useSession();
  const isDoctor = session?.user.role === roles.doctor;
  const isReceptionist = session?.user.role === roles.receptionist;
  const isAdminOrHigher = isHigherOrEqualInRoleHierarchy(
    session?.user.role,
    roles.admin
  );

  return { isDoctor, isReceptionist, isAdminOrHigher };
};

export default useRoles;
