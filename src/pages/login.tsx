import FormLogin from '@/components/forms/FormLogin';
import paths from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const Login: Page = () => (
  <>
    <Head>
      <title>CliniFácil | Faça seu Login</title>
    </Head>
    <div className="flex h-screen items-center justify-center">
      <FormLogin />
    </div>
  </>
);

Login.auth = 'wait';
Login.loggedInRedirect = paths.records;

export default Login;
