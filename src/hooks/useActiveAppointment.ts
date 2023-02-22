import { trpc } from '@/services/trpc';
import useActiveDoctor from './useActiveDoctor';

const useActiveAppointment = ({ patientId }: { patientId: number }) => {
  const { data: doctor } = useActiveDoctor();

  const query = trpc.appointment.active.useQuery(
    {
      patientId,
      doctorId: doctor?.id ?? 0,
    },
    { enabled: !!doctor && !!patientId }
  );

  return query;
};

export default useActiveAppointment;
