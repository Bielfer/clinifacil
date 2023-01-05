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
      <Text h2>Crie um novo paciente</Text>
      <FormPatient />
    </Sidebar>
  </>
);

PatientsNew.auth = 'block';
PatientsNew.allowHigherOrEqualRole = 'RECEPTIONIST';

export default PatientsNew;
