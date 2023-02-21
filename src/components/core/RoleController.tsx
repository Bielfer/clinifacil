import { roles } from '@/constants/roles';
import { isHigherOrEqualInRoleHierarchy } from '@/helpers/roles';
import { Role } from '@/types/role';
import { useSession } from 'next-auth/react';

type Props = {
  role: Role;
  adminRole?: Role;
  children: JSX.Element;
  show?: boolean;
};

const RoleController = ({
  role,
  adminRole = roles.admin,
  children,
  show = true,
}: Props) => {
  const { data: session } = useSession();
  const userRole = session?.user.role;

  if (isHigherOrEqualInRoleHierarchy(userRole, adminRole)) return children;

  if (!show && role === userRole) return null;

  if (!show && role !== userRole) return children;

  if (role !== userRole) return null;

  return children;
};

export default RoleController;
