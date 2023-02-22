import LoadingWrapper from '@/components/core/LoadingWrapper';
import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormHandbook from '@/components/forms/FormHandbook';
import { sidebarPaths } from '@/constants/paths';
import useActiveDoctor from '@/hooks/useActiveDoctor';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientNewHandbook: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: doctor } = useActiveDoctor();
  const { data: activeAppointment, isLoading: isLoadingAppointment } =
    trpc.appointment.active.useQuery(
      {
        patientId: parseInt(patientId, 10),
        doctorId: doctor?.id ?? 0,
      },
      { enabled: !!doctor && !!patientId }
    );

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
          <LoadingWrapper loading={isLoadingAppointment}>
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
