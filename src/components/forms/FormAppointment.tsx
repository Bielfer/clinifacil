import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { useRoles } from '@/hooks';
import { trpc } from '@/services/trpc';
import useReceptionistStore from '@/store/receptionist';
import clsx from 'clsx';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import Button from '../core/Button';
import { useToast } from '../core/Toast';
import FormikSelect from './FormikSelect';

interface Props {
  className?: string;
}
const FormAppointment: FC<Props> = ({ className }) => {
  const { addToast } = useToast();
  const { isDoctor } = useRoles();
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: session } = useSession();
  const { data: doctor } = trpc.doctor.get.useQuery(
    {
      userId: session?.user.id,
    },
    { enabled: !!session }
  );
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
  };

  const validationSchema = z.object({
    typeId: z.number().min(1, validations.required),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const [, error] = await tryCatch(
      createAppointment({
        appointmentTypeId: values.typeId,
        doctorId: 1,
        patientId: parseInt(patientId, 10),
      })
    );

    if (error) {
      addToast({ type: 'error', content: 'Erro ao criar consulta!' });
      return;
    }

    router.push(paths.queue);
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
