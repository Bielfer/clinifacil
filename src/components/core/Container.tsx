import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

const Container = ({ className, children, ...props }: Props) => (
  <div
    className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}
    {...props}
  >
    {children}
  </div>
);

export default Container;
