import { useToast } from '@/components/core/Toast';
import type { Patient } from '@prisma/client';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';

type Props = {
  patient?: Patient;
};

const ChangeMessageDynamically: FC<Props> = ({ patient }) => {
  const { addToast } = useToast();
  const { values, setFieldValue } = useFormikContext<{
    startDate: Date;
    duration: number;
    message: string;
  }>();

  if (!patient) {
    addToast({
      type: 'error',
      content:
        'Houve um erro ao pegar o nome do paciente, tente recarregar a página!',
    });
  }

  const message = `A pedido do interessado, Sr. ${
    patient?.name
  }, na qualidade de seu médico assistente, atesto para os devidos fins que o mesmo, por motivo de doença, ficou (ou ficará) impossibilitado de exercer suas atividades durante ${
    values.duration
  } dia(s), a partir de ${format(values.startDate, 'dd/MM/yyyy')}`;

  useEffect(() => {
    setFieldValue('message', message);
  }, [
    setFieldValue,
    patient?.name,
    values.duration,
    values.startDate,
    message,
  ]);

  return null;
};

export default ChangeMessageDynamically;
