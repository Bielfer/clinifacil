import { useField } from 'formik';
import Select from '../core/Select';

interface Props {
  name: string;
  type?: 'string' | 'integer' | 'float';
  options: Array<{ text: string; value: string }>;
  label?: string;
  hint?: string;
}

const FormikSelect = ({ name, type, options, label, hint }: Props) => {
  const [{ value }, { error }, { setValue }] = useField(name);

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
      error={error}
      hint={hint}
    />
  );
};

export default FormikSelect;
