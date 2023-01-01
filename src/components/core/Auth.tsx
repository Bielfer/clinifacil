import paths from '@/constants/paths';
import { AuthType } from '@/types/auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Spinner from './Spinner';

interface Props {
  children: JSX.Element;
  type?: AuthType;
  loggedInRedirect?: string;
}

const Auth = ({ children, type = 'allow', loggedInRedirect }: Props) => {
  const router = useRouter();
  const { status } = useSession();
  const isLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated';

  if (isLoading && type === 'wait') {
    return <Spinner page size="xl" />;
  }

  if (!isLoggedIn && type === 'block') {
    if (isLoading) return <Spinner page size="xl" />;
    router.replace(paths.login);
    return <Spinner page size="xl" />;
  }

  if (isLoggedIn && loggedInRedirect) {
    router.replace(loggedInRedirect);

    return <Spinner page size="xl" />;
  }

  return children;
};

export default Auth;
