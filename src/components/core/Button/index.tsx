import { ButtonHTMLAttributes } from 'react';
import Spinner from '@/components/core/Spinner';
import clsx from 'clsx';
import { IconType } from '@/types/core';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'submit' | 'button';
  iconLeft?: IconType;
  iconRight?: IconType;
  variant?: keyof typeof variantStyles;
  size?: keyof typeof buttonSizes;
  loading?: boolean;
}

export const variantStyles = {
  primary:
    'border border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  secondary:
    'border border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  white:
    'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  'link-primary':
    'rounded-lg py-1 px-2 text-primary-700 hover:bg-primary-100 hover:text-primary-900',
  'link-secondary':
    'rounded-lg py-1 px-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900',
};

export const buttonSizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

const Button = ({
  type,
  className,
  iconLeft: IconLeft,
  iconRight: IconRight,
  children,
  variant = 'white',
  size = 'md',
  loading,
  ...props
}: ButtonProps) => {
  const buttonStyles = !variant.includes('link') ? 'rounded-lg shadow-sm' : '';

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={clsx(
        'inline-flex items-center font-medium transition duration-200',
        buttonStyles,
        variantStyles[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" color="white" />
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
