import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';

const ChangeInstructionsDynamically: FC = () => {
  const { values, setFieldValue } = useFormikContext<{
    interval: number;
    duration: number;
  }>();

  const instructions = `Tomar 1 comprimido via oral de ${values.interval}/${values.interval} horas por ${values.duration} dias`;

  useEffect(() => {
    setFieldValue('instructions', instructions);
  }, [setFieldValue, instructions]);

  return null;
};

export default ChangeInstructionsDynamically;
