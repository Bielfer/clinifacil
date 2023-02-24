import { useField } from 'formik';
import MySwitch from '../core/MySwitch';

interface Props {
  name: string;
  label?: string | null;
  className?: string;
}

const FormikSwitch = ({ name, label, className }: Props) => {
  const [{ value }, , { setValue }] = useField(name);

  return (
    <MySwitch
      label={label}
      className={className}
      checked={value}
      onChange={() => setValue(!value)}
    />
  );
};

export default FormikSwitch;
