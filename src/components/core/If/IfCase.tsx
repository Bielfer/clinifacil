/* eslint react/jsx-no-useless-fragment:off */
import type { FC, ReactNode } from 'react';

type Props = {
  condition: boolean;
  children: ReactNode;
};

const IfCase: FC<Props> = ({ condition, children }) => {
  if (!condition) return null;
  return <>{children}</>;
};

export default IfCase;
