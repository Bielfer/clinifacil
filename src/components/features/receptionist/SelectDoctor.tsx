import Dropdown from '@/components/core/Dropdown';
import { trpc } from '@/services/trpc';
import useReceptionistStore from '@/store/receptionist';
import { useSession } from 'next-auth/react';

type Props = {
  className?: string;
};

const SelectDoctor = ({ className }: Props) => {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { data: receptionist } = trpc.receptionist.get.useQuery(
    {
      userId,
    },
    { enabled: !!userId }
  );
  const [selectedDoctorId, setSelectedDoctorId] = useReceptionistStore(
    (state) => [state.selectedDoctorId, state.setSelectedDoctorId]
  );

  return (
    <Dropdown
      className={className}
      data={
        receptionist?.doctors.map((doctor) => ({
          text: doctor.name,
          value: doctor.id,
        })) ?? []
      }
      setValue={(value) => setSelectedDoctorId(value)}
      value={selectedDoctorId ?? 0}
      defaultText="Médicos"
    />
  );
};

export default SelectDoctor;
