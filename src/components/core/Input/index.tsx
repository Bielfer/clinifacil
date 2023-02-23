import clsx from 'clsx';
import { ChangeEvent, FC } from 'react';
import InputLayout from '../InputLayout';

interface Props {
  label?: string;
  password?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  type?: 'password' | 'text';
  disabled?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
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
  disabled,
  value,
  onChange,
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
      onChange={onChange}
      value={value}
      className={clsx(
        'block w-full rounded-lg border',
        disabled && 'bg-gray-200',
        !error
          ? 'border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
          : 'border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'
      )}
      placeholder={placeholder}
      type={password ? 'password' : type ?? 'text'}
      id={name}
      disabled={disabled}
    />
  </InputLayout>
);

export default Input;
