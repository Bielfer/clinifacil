import { useField } from 'formik';
import { ChangeEvent, InputHTMLAttributes, useState } from 'react';
import Input from '../core/Input';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  hint?: string;
  format?: 'default' | 'currency';
}

const FormikNumber = ({
  name,
  label,
  hint,
  className,
  format = 'default',
  ...props
}: Props) => {
  const [, { error, initialValue, touched }, { setValue }] = useField(name);
  const [input, setInput] = useState(initialValue);

  const formats = {
    default: (value: string) => Number(value.replace(',', '.')),
    currency: (value: string) =>
      Math.floor(Number(value.replace(',', '.')) * 100),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setInput(value);
    setValue(formats[format](value));
  };

  return (
    <Input
      value={input}
      onChange={handleChange}
      label={label}
      className={className}
      error={touched && error ? error : ''}
      hint={hint}
      {...props}
    />
  );
};

export default FormikNumber;
