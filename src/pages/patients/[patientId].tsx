import Sidebar from '@/components/core/Sidebar';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const PatientsById: Page = () => {
  const t = 't';

  return (
    <>
      <Head>
        <title>CliniFácil | Ver Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>Test</Sidebar>
    </>
  );
};

export default PatientsById;
