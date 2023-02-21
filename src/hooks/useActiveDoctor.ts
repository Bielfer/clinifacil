import { trpc } from '@/services/trpc';
import useReceptionistStore from '@/store/receptionist';
import { useSession } from 'next-auth/react';
import useRoles from './useRoles';

const useActiveDoctor = () => {
  const { isDoctor } = useRoles();
  const { data: session } = useSession();
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );

  const query = isDoctor
    ? { userId: session?.user.id }
    : { id: selectedDoctorId };

  const data = trpc.doctor.get.useQuery(query, {
    enabled: isDoctor ? !!session : !!selectedDoctorId,
  });

  return data;
};

export default useActiveDoctor;
