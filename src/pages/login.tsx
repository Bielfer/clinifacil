import FormLogin from '@/components/forms/FormLogin';
import paths from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';

const Login: Page = () => (
  <>
    <Head>
      <title>Faça seu Login | ezClin</title>
    </Head>
    <div className="flex items-center justify-center h-screen">
      <FormLogin />
    </div>
  </>
);

Login.auth = 'wait';
Login.loggedInRedirect = paths.records;

export default Login;
