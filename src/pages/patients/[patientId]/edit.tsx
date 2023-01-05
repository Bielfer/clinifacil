import LoadingWrapper from '@/components/core/LoadingWrapper';
import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormPatient from '@/components/forms/FormPatient';
import { sidebarPaths } from '@/constants/paths';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientsById: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: patient, isLoading } = trpc.patient.getById.useQuery(
    {
      id: parseInt(patientId, 10),
    },
    { enabled: !!patientId }
  );

  return (
    <>
      <Head>
        <title>CliniFácil | Altere o Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <Text h2>Altere o Paciente</Text>
        <LoadingWrapper loading={isLoading}>
          <FormPatient className="mt-6" patient={patient} />
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

export default PatientsById;
