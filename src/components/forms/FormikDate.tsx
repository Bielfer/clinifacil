import { useField } from 'formik';
import type { FC } from 'react';
import DateInput from '../core/DateInput';

type Props = {
  name: string;
  className?: string;
  hint?: string;
  label?: string;
  disabled?: boolean;
};

const FormikDate: FC<Props> = ({ name, className, hint, label, disabled }) => {
  const [{ value }, { touched, error }, { setValue }] = useField(name);
  return (
    <DateInput
      className={className}
      label={label}
      date={value}
      setDate={setValue}
      name={name}
      error={touched && error ? error : ''}
      hint={hint}
      disabled={disabled}
    />
  );
};

export default FormikDate;
