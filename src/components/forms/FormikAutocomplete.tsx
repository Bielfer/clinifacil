import { useFormikContext } from 'formik';
import { FC, useEffect, useState } from 'react';
import Autocomplete from '../core/Autocomplete';

interface Props {
  name: string;
  options: { text: string; value: string }[];
  label?: string;
  hint?: string;
  disabled?: boolean;
  defaultOption?: { text: string; value: string };
}

const FormikAutocomplete: FC<Props> = ({
  name,
  options,
  label,
  hint,
  disabled,
  defaultOption,
}) => {
  const { touched, errors, setFieldValue } = useFormikContext<{
    [name: string]: boolean;
  }>();
  const [selectedOption, setSelectedOption] = useState<
    | {
        text: string;
        value: string;
      }
    | undefined
  >(defaultOption);

  useEffect(() => {
    setFieldValue(name, selectedOption?.value);
  }, [selectedOption?.value, setFieldValue, name]);

  return (
    <Autocomplete
      label={label}
      selected={selectedOption ?? { text: '', value: '' }}
      setSelected={(e) => setSelectedOption(e)}
      name={name}
      options={options}
      error={touched[name] && errors[name] ? errors[name] : ''}
      hint={hint}
      disabled={disabled}
    />
  );
};

export default FormikAutocomplete;
