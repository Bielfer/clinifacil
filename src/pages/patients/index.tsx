import Sidebar from '@/components/core/Sidebar';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const Patients: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Meus Pacientes</title>
    </Head>
    <Sidebar items={sidebarPaths}>
      <div>temp</div>
    </Sidebar>
  </>
);

export default Patients;
