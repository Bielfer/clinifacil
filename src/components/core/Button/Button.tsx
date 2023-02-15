import type { FC, ReactNode } from 'react';
import Spinner from '@/components/core/Spinner';
import clsx from 'clsx';
import { IconType } from '@/types/core';

export type ButtonProps = {
  className?: string;
  children: ReactNode;
  type?: 'submit' | 'button';
  iconLeft?: IconType;
  iconRight?: IconType;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export const variantStyles = {
  primary:
    'border border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  secondary:
    'border border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  white:
    'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  'link-primary':
    'text-primary-700 hover:bg-primary-100 hover:text-primary-900',
  'link-secondary': 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  'link-error': 'text-red-700 hover:bg-red-100 hover:text-red-900',
};

export const buttonSizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

const Button: FC<ButtonProps> = ({
  type,
  className,
  iconLeft: IconLeft,
  iconRight: IconRight,
  children,
  variant = 'white',
  size = 'md',
  loading,
  disabled,
  ...props
}) => {
  const isButton = !variant.includes('link');
  const buttonStyles = isButton ? 'shadow-sm' : '';

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={clsx(
        'inline-flex items-center whitespace-nowrap rounded-lg font-medium transition duration-200',
        buttonStyles,
        variantStyles[variant],
        buttonSizes[size],
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color="inherit" />
      ) : (
        <>
          {IconLeft && (
            <IconLeft className="-ml-0.5 mr-2 h-5 w-5 flex-shrink-0" />
          )}
          {children}
          {IconRight && (
            <IconRight className="ml-2 -mr-0.5 h-5 w-5 flex-shrink-0" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
