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
      className={
        !error
          ? 'shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
          : 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
      }
      placeholder={placeholder}
      type={password ? 'password' : type ?? 'text'}
      id={name}
      {...props}
    />
  </InputLayout>
);

export default Input;
