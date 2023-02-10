import Sidebar from '@/components/core/Sidebar';
import { sidebarPaths } from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const NewPatientAppointment: Page = () => (
  <>
    <Head>
      <title>CliniFácil | </title>
    </Head>
    <Sidebar items={sidebarPaths}>New appointment page</Sidebar>
  </>
);

export default NewPatientAppointment;
