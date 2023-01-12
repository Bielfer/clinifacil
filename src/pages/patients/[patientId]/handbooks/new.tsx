import LoadingWrapper from '@/components/core/LoadingWrapper';
import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormHandbook from '@/components/forms/FormHandbook';
import { sidebarPaths } from '@/constants/paths';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientNewHandbook: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: session } = useSession();
  const { data: doctor } = trpc.doctor.get.useQuery({
    userId: session?.user.id,
  });
  const { data: appointments, isLoading: isLoadingAppointments } =
    trpc.appointment.getMany.useQuery({
      patientId: parseInt(patientId, 10),
      doctorId: doctor?.id,
    });
  const activeAppointment = appointments?.[0];

  return (
    <>
      <Head>
        <title>CliniFácil | Prontuário do Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="mx-auto max-w-2xl">
          <Text h2 className="pb-6">
            Consulta do Paciente
          </Text>
          <LoadingWrapper loading={isLoadingAppointments}>
            <FormHandbook appointmentId={activeAppointment?.id} />
          </LoadingWrapper>
        </div>
      </Sidebar>
    </>
  );
};
PatientNewHandbook.auth = 'block';
PatientNewHandbook.allowHigherOrEqualRole = 'DOCTOR';

export default PatientNewHandbook;
