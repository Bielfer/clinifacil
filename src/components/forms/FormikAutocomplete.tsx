import { useField } from 'formik';
import { FC } from 'react';
import Autocomplete from '../core/Autocomplete';

interface Props {
  name: string;
  options: { text: string; value: string }[];
  label?: string | null;
  hint?: string;
  disabled?: boolean;
}

const FormikAutocomplete: FC<Props> = ({
  name,
  options,
  label,
  hint,
  disabled,
}) => {
  const [{ value }, { touched, error }, { setValue }] = useField(name);

  return (
    <Autocomplete
      label={label}
      selected={value}
      setSelected={(e) => setValue(e)}
      name={name}
      options={options}
      error={(touched && error ? error : '') as string}
      hint={hint}
      disabled={disabled}
    />
  );
};

export default FormikAutocomplete;
