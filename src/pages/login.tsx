import FormLogin from '@/components/forms/FormLogin';
import paths from '@/constants/paths';
import { getServerAuthSession } from '@/helpers/server';
import { Page } from '@/types/auth';
import { getCsrfToken } from 'next-auth/react';
import Head from 'next/head';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next/types';

const Login: Page<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  csrfToken,
}) => (
  <>
    <Head>
      <title>Faça seu Login | CliniFácil</title>
    </Head>
    <div className="flex h-screen items-center justify-center">
      <FormLogin csrfToken={csrfToken} />
    </div>
  </>
);

Login.auth = 'wait';
Login.loggedInRedirect = paths.records;

export const getServerSideProps: GetServerSideProps<{
  csrfToken?: string;
}> = async (ctx) => {
  const { req, res } = ctx;
  const session = await getServerAuthSession({ req, res });

  if (session)
    return {
      redirect: {
        destination: paths.records,
        permanent: false,
      },
      props: {
        csrfToken: null,
      },
    };

  return {
    props: {
      csrfToken: await getCsrfToken(ctx),
    },
  };
};

export default Login;
