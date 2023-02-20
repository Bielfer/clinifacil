import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormExam from '@/components/forms/FormExam';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const NewPatientExam: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Solicite um Novo Exame</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2 className="pb-6">
          Solicite um Novo Exame
        </Text>
        <FormExam />
      </div>
    </Sidebar>
  </>
);

NewPatientExam.auth = 'block';
NewPatientExam.allowHigherOrEqualRole = 'DOCTOR';

export default NewPatientExam;
