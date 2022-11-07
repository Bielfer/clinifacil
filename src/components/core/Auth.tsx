import paths from '@/constants/paths';
import { useAuth } from '@/contexts/auth';
import { AuthType } from '@/types/auth';
import { useRouter } from 'next/router';
import Spinner from './Spinner';

interface Props {
  children: JSX.Element;
  type?: AuthType;
  loggedInRedirect?: string;
}

const Auth = ({ children, type = 'allow', loggedInRedirect }: Props) => {
  const router = useRouter();
  const { loggedIn, loading } = useAuth();

  if (loading && type === 'wait') {
    return <Spinner page size="xl" />;
  }

  if (!loggedIn && type === 'block') {
    if (loading) return <Spinner page size="xl" />;
    router.replace(paths.login);
    return <Spinner page size="xl" />;
  }

  if (loggedIn && loggedInRedirect) {
    router.replace(loggedInRedirect);

    return <Spinner page size="xl" />;
  }

  return children;
};

export default Auth;
