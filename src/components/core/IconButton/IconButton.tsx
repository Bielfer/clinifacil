import { IconType } from '@/types/core';
import clsx from 'clsx';
import type { FC } from 'react';
import { variantStyles } from '../Button';
import Spinner from '../Spinner';

type Props = {
  icon: IconType;
  className?: string;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof buttonPaddings;
  loading?: boolean;
  onClick?: () => void;
};

const iconSizes = {
  xs: 'h-5 w-5',
  sm: 'h-5 w-5',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-6 w-6',
};

const buttonPaddings = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2',
  xl: 'p-3',
};

const IconButton: FC<Props> = ({
  icon: Icon,
  className,
  variant = 'white',
  size = 'md',
  loading,
  onClick,
}) => {
  const isButton = !variant.includes('link');
  const buttonStyles = isButton ? 'shadow-sm' : '';

  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center rounded-full',
        buttonStyles,
        variantStyles[variant],
        buttonPaddings[size],
        className
      )}
      onClick={onClick}
    >
      {loading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <Icon className={iconSizes[size]} aria-hidden="true" />
      )}
    </button>
  );
};

export default IconButton;
