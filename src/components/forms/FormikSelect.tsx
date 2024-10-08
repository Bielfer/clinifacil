import { useField } from 'formik';
import Select from '../core/Select';

interface Props {
  name: string;
  type?: 'string' | 'integer' | 'float';
  options: Array<{ text: string; value: string | number }>;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

const FormikSelect = ({
  name,
  type,
  options,
  label,
  hint,
  disabled,
}: Props) => {
  const [{ value }, { error, touched }, { setValue }] = useField(name);

  return (
    <Select
      label={label}
      selected={value}
      setSelected={(e) => {
        let targetValue: string | number = e;

        if (type === 'integer') targetValue = parseInt(targetValue, 10);
        if (type === 'float') targetValue = parseFloat(targetValue as string);

        setValue(targetValue);
      }}
      name={name}
      options={options}
      error={touched && error ? error : ''}
      hint={hint}
      disabled={disabled}
    />
  );
};

export default FormikSelect;
