import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { IconType } from '@/types/core';
import { buttonSizes } from '../Button';

export type MyLinkProps = {
  className?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof buttonSizes;
  iconLeft?: IconType;
  iconRight?: IconType;
  href: string;
  children: ReactNode;
  onClick?: () => void;
};

const variants = {
  white: '',
  primary:
    'rounded-lg text-primary-700 hover:bg-primary-100 hover:text-primary-900',
  secondary:
    'rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  'button-primary':
    'border border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  'button-secondary':
    'border border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  'button-white':
    'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
};

const MyLink: FC<MyLinkProps> = ({
  className,
  children,
  variant = 'white',
  href,
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) => {
  const linkStyles = !variant.includes('button') ? '' : 'rounded-lg shadow-sm';

  return (
    <Link
      href={href || ''}
      passHref
      className={clsx(
        'inline-flex items-center whitespace-nowrap font-medium transition duration-200',
        linkStyles,
        variants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {IconLeft && <IconLeft className="-ml-0.5 mr-2 h-5 w-5 flex-shrink-0" />}
      {children}
      {IconRight && (
        <IconRight className="ml-2 -mr-0.5 h-5 w-5 flex-shrink-0" />
      )}
    </Link>
  );
};
export default MyLink;
