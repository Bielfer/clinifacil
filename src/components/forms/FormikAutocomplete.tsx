import { useFormikContext } from 'formik';
import { FC, useEffect, useState } from 'react';
import Autocomplete from '../core/Autocomplete';

interface Props {
  name: string;
  options: { text: string; value: string }[];
  label?: string;
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
  const { touched, errors, setFieldValue, values } = useFormikContext<{
    [name: string]: any;
  }>();
  const [selectedOption, setSelectedOption] = useState<{
    text: string;
    value: string;
  }>(
    options.find((option) => option.value === values[name]) ?? {
      text: '',
      value: '',
    }
  );

  useEffect(() => {
    setFieldValue(name, selectedOption?.value);
  }, [selectedOption?.value, setFieldValue, name]);

  return (
    <Autocomplete
      label={label}
      selected={selectedOption}
      setSelected={(e) => setSelectedOption(e)}
      name={name}
      options={options}
      error={(touched[name] && errors[name] ? errors[name] : '') as string}
      hint={hint}
      disabled={disabled}
    />
  );
};

export default FormikAutocomplete;
