import LoadingWrapper from '@/components/core/LoadingWrapper';
import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormPatient from '@/components/forms/FormPatient';
import { sidebarPaths } from '@/constants/paths';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientsByIdEdit: Page = () => {
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
        <div className="mx-auto max-w-2xl">
          <Text h2>Altere o Paciente</Text>
          <LoadingWrapper loading={isLoading}>
            <FormPatient className="mt-6" patient={patient} />
          </LoadingWrapper>
        </div>
      </Sidebar>
    </>
  );
};

PatientsByIdEdit.auth = 'block';
PatientsByIdEdit.allowHigherOrEqualRole = 'RECEPTIONIST';

export default PatientsByIdEdit;
