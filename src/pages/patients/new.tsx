import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormPatient from '@/components/forms/FormPatient';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const PatientsNew: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Nova Consulta</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2 className="py-6">
          Crie um novo paciente
        </Text>
        <FormPatient />
      </div>
    </Sidebar>
  </>
);

PatientsNew.auth = 'block';
PatientsNew.allowHigherOrEqualRole = 'RECEPTIONIST';

export default PatientsNew;
