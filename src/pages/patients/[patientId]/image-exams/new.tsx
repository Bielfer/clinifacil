import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormImageExam from '@/components/forms/FormImageExam';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const NewPatientImageExam: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Guarde o Exame de Imagem</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2 className="pb-6">
          Guarde o Exame de Imagem
        </Text>
        <FormImageExam />
      </div>
    </Sidebar>
  </>
);

NewPatientImageExam.auth = 'block';
NewPatientImageExam.allowHigherOrEqualRole = 'DOCTOR';

export default NewPatientImageExam;
