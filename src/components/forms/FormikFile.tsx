import { useField } from 'formik';
import { useRef } from 'react';
import Button, { ButtonProps } from '../core/Button';
import InputLayout from '../core/InputLayout';

interface Props extends ButtonProps {
  name: string;
  hint?: string;
  label?: string;
}

const FormikFile = ({
  className,
  name,
  children,
  label,
  hint,
  ...props
}: Props) => {
  const [, { error, touched }, { setValue }] = useField(name);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <InputLayout
      className={className}
      error={touched && error ? error : ''}
      hint={hint}
      label={label}
      name={name}
    >
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        onChange={(e) => setValue(e.target.files?.[0])}
      />
      <Button onClick={() => inputRef.current?.click()} {...props}>
        {children}
      </Button>
    </InputLayout>
  );
};

export default FormikFile;
