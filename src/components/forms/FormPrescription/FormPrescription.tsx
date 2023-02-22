import Button from '@/components/core/Button';
import { useToast } from '@/components/core/Toast';
import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { useActiveAppointment, useActiveDoctor } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import FormikAutocomplete from '../FormikAutocomplete';
import FormikNumber from '../FormikNumber';
import FormikTextarea from '../FormikTextarea';

const FormPrescription: FC = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const { data: doctor } = useActiveDoctor();
  const { data: medications } = trpc.doctor.medications.useQuery(
    { doctorId: doctor?.id ?? 0 },
    { enabled: !!doctor }
  );
  const { mutateAsync: createPrescription } =
    trpc.prescription.create.useMutation();
  const { data: activeAppointment, refetch: refetchAppointment } =
    useActiveAppointment({ patientId: parseInt(patientId, 10) });

  const initialValues = {
    medicationName: '',
    boxAmount: 1,
    instructions: 'Tomar 1 comprimido via oral de 0/0 horas por 0 dias',
  };

  const validate = z.object({
    medicationName: z.string({ required_error: validations.required }),
    boxAmount: z
      .number({ required_error: validations.required })
      .min(0, validations.minValue(1)),
    instructions: z
      .string({ required_error: validations.required })
      .max(191, validations.maxCharacters(191)),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!activeAppointment) {
      addToast({
        type: 'error',
        content:
          'Não foi encontrada uma consulta aberta para esse paciente, tente novamente em 5 segundos!',
      });
      refetchAppointment();
      return;
    }

    const [, error] = await tryCatch(
      createPrescription({
        ...values,
        appointmentId: activeAppointment?.id,
      })
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Falha ao adicionar esse remédio na receita!',
      });
      return;
    }

    router.push(paths.patientPrescriptions(patientId));
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validate)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="flex flex-col gap-y-6">
          <FormikAutocomplete
            name="medicationName"
            hint={hints.required}
            label="Nome da Medicação"
            options={
              medications?.map(({ name }) => ({
                text: name,
                value: name,
              })) ?? []
            }
          />
          <FormikNumber
            name="boxAmount"
            label="Quantidade de Caixas"
            hint={hints.required}
          />
          <FormikTextarea
            name="instructions"
            hint={hints.required}
            label="Instruções para uso da Medicação"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormPrescription;
