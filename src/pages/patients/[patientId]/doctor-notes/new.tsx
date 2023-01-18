import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormDoctorNote from '@/components/forms/FormDoctorNote';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const NewPatientDoctorNote: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Crie um novo Atestado</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2 className="pb-6">
          Crie um novo Atestado
        </Text>
        <FormDoctorNote />
      </div>
    </Sidebar>
  </>
);

NewPatientDoctorNote.auth = 'block';
NewPatientDoctorNote.allowHigherOrEqualRole = 'DOCTOR';

export default NewPatientDoctorNote;
