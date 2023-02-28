import { IconType } from '@/types/core';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import { Url } from 'url';
import { variantStyles } from '../MyLink';
import Spinner from '../Spinner';

type Props = {
  icon: IconType;
  className?: string;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof paddings;
  loading?: boolean;
  href: string | Partial<Url>;
};

const iconSizes = {
  xs: 'h-5 w-5',
  sm: 'h-5 w-5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-6 w-6',
};

const paddings = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2',
  xl: 'p-3',
};

const IconLink: FC<Props> = ({
  icon: Icon,
  className,
  variant = 'white',
  size = 'md',
  loading,
  href,
}) => {
  const linkStyles = !variant.includes('button') ? '' : 'shadow-sm';

  return (
    <Link
      href={href}
      type="button"
      className={clsx(
        'inline-flex items-center rounded-full',
        linkStyles,
        variantStyles[variant],
        paddings[size],
        className
      )}
    >
      {loading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <Icon className={iconSizes[size]} aria-hidden="true" />
      )}
    </Link>
  );
};

export default IconLink;
