import clsx from 'clsx';
import { useField } from 'formik';
import { TextareaHTMLAttributes } from 'react';
import InputLayout from '../core/InputLayout';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  hint?: string;
  label?: string;
  classNameTextarea?: string;
}

const FormikTextarea = ({
  name,
  className,
  hint,
  label,
  placeholder,
  classNameTextarea,
}: Props) => {
  const [{ value }, { error }, { setValue }] = useField(name);

  const errorStyles = !error
    ? 'shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md'
    : 'block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md';

  return (
    <InputLayout
      name={name}
      className={className}
      error={error}
      hint={hint}
      label={label}
      shadow
    >
      <textarea
        className={clsx(errorStyles, classNameTextarea)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
    </InputLayout>
  );
};

export default FormikTextarea;
