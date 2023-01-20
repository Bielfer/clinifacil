import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormPrescription from '@/components/forms/FormPrescription';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const NewPatientPrescription: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Adicione um remédio a Receita</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2 className="pb-6">
          Adicione um remédio a Receita
        </Text>
        <FormPrescription />
      </div>
    </Sidebar>
  </>
);

NewPatientPrescription.auth = 'block';
NewPatientPrescription.allowHigherOrEqualRole = 'DOCTOR';

export default NewPatientPrescription;
