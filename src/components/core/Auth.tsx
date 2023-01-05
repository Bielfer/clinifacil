import paths from '@/constants/paths';
import { isHigherOrEqualInRoleHierarchy } from '@/helpers/roles';
import { AuthType } from '@/types/auth';
import { Role } from '@/types/role';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Page403 from './Page403';
import Spinner from './Spinner';

interface Props {
  children: JSX.Element;
  type?: AuthType;
  allowHigherOrEqualRole?: Role;
  loggedInRedirect?: string;
}

const Auth = ({
  children,
  type = 'allow',
  allowHigherOrEqualRole,
  loggedInRedirect,
}: Props) => {
  const router = useRouter();
  const { status, data: session } = useSession();
  const isLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated';
  const isUnauthenticated = status === 'unauthenticated';
  const userRole = session?.user.role;

  if (isLoading && (type === 'wait' || type === 'block')) {
    return <Spinner page size="xl" />;
  }

  if (
    allowHigherOrEqualRole &&
    userRole &&
    !isHigherOrEqualInRoleHierarchy(userRole, allowHigherOrEqualRole)
  ) {
    return <Page403 />;
  }

  if (isUnauthenticated && type === 'block') {
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
