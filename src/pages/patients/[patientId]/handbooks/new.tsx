import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormHandbook from '@/components/forms/FormHandbook';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const PatientNewHandbook: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Prontuário do Paciente</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2>Prontuário do Paciente</Text>
        <FormHandbook />
      </div>
    </Sidebar>
  </>
);

PatientNewHandbook.auth = 'block';
PatientNewHandbook.allowHigherOrEqualRole = 'DOCTOR';

export default PatientNewHandbook;
