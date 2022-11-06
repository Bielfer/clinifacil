import React, { AnchorHTMLAttributes, FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'white';

export interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  variant?: Variant;
}

const variants = {
  white: '',
  primary:
    'rounded-lg py-1 px-2 text-primary-700 hover:bg-primary-100 hover:text-primary-900',
  secondary:
    'rounded-lg py-1 px-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900',
};

const MyLink: FC<Props> = ({
  className,
  children,
  variant = 'white',
  href,
  ...props
}) => (
  <Link
    href={href || ''}
    passHref
    className={clsx('cursor-pointer', variants[variant], className)}
    {...props}
  >
    {children}
  </Link>
);

export default MyLink;
