import { roles } from '@/constants/roles';
import { useSession } from 'next-auth/react';

const useRoles = () => {
  const { data: session } = useSession();
  const isDoctor = session?.user.role === roles.doctor;
  const isReceptionist = session?.user.role === roles.receptionist;

  return { isDoctor, isReceptionist };
};

export default useRoles;
