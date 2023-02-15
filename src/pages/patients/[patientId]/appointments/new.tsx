import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormAppointment from '@/components/forms/FormAppointment';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const NewPatientAppointment: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Crie a Consulta</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div className="mx-auto max-w-2xl">
        <Text h2 className="pb-6">
          Criar Consulta
        </Text>
        <FormAppointment />
      </div>
    </Sidebar>
  </>
);

NewPatientAppointment.auth = 'block';
NewPatientAppointment.allowHigherOrEqualRole = 'RECEPTIONIST';

export default NewPatientAppointment;
