import { appointmentStatus } from '@/constants/appointment-status';
import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { useActiveDoctor, useRoles } from '@/hooks';
import { trpc } from '@/services/trpc';
import useReceptionistStore from '@/store/receptionist';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import Button from '../core/Button';
import { useToast } from '../core/Toast';
import FormikDate from './FormikDate';
import FormikSelect from './FormikSelect';

interface Props {
  className?: string;
  onSubmitRedirectUrl?: string;
}
const FormAppointment: FC<Props> = ({ className, onSubmitRedirectUrl }) => {
  const { addToast } = useToast();
  const { isDoctor } = useRoles();
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: doctor } = useActiveDoctor();
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );
  const { data: appointmentTypes } = trpc.doctor.appointmentTypes.useQuery({
    doctorId: (isDoctor ? doctor?.id : selectedDoctorId) ?? 0,
  });
  const { mutateAsync: createAppointment } =
    trpc.appointment.create.useMutation();

  const initialValues = {
    typeId: 0,
    realizationDate: new Date(),
  };

  const validationSchema = z.object({
    typeId: z.number().min(1, validations.required),
    realizationDate: z.date().optional(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!doctor) {
      addToast({
        content: 'Ocorreu um erro, tente novamente em 5 segundos!',
        type: 'error',
      });
      return;
    }

    const [, error] = await tryCatch(
      createAppointment({
        appointmentTypeId: values.typeId,
        doctorId: doctor.id,
        patientId: parseInt(patientId, 10),
        realizationDate: values.realizationDate,
        ...(onSubmitRedirectUrl && { status: appointmentStatus.finished }),
      })
    );

    if (error) {
      addToast({ type: 'error', content: 'Erro ao criar consulta!' });
      return;
    }

    router.push(onSubmitRedirectUrl ?? paths.queue);
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={clsx('flex flex-col gap-y-6', className)}>
          <FormikSelect
            name="typeId"
            label="Tipo de Consulta"
            hint={hints.required}
            type="integer"
            options={
              appointmentTypes?.map((appointmentType) => ({
                text: appointmentType.name,
                value: appointmentType.id,
              })) ?? []
            }
          />
          <FormikDate name="realizationDate" label="Data da Consulta" />

          <div className="flex justify-end">
            <Button variant="primary" loading={isSubmitting} type="submit">
              Criar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormAppointment;
