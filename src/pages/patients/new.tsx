import Sidebar from '@/components/core/Sidebar';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const PatientsNew: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Nova Consulta</title>
    </Head>
    <Sidebar items={sidebarPaths}>Temp</Sidebar>
  </>
);

export default PatientsNew;
