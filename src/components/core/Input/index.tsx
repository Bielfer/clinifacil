import clsx from 'clsx';
import { FC, InputHTMLAttributes } from 'react';
import InputLayout from '../InputLayout';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  password?: boolean;
  error?: string;
  hint?: string;
}

const Input: FC<Props> = ({
  label,
  placeholder,
  password,
  className,
  type,
  error,
  name,
  hint,
  ...props
}) => (
  <InputLayout
    name={name}
    className={className}
    error={error}
    hint={hint}
    label={label}
    shadow
  >
    <input
      className={clsx(
        'block w-full rounded-lg border',
        !error
          ? 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
          : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'
      )}
      placeholder={placeholder}
      type={password ? 'password' : type ?? 'text'}
      id={name}
      {...props}
    />
  </InputLayout>
);

export default Input;
