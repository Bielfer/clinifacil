import Button from '@/components/core/Button';
import { useToast } from '@/components/core/Toast';
import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { trpc } from '@/services/trpc';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import FormikAutocomplete from './FormikAutocomplete';

const FormExam: FC = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const { data: session } = useSession();
  const { data: doctor } = trpc.doctor.get.useQuery(
    {
      userId: session?.user.id,
    },
    { enabled: !!session }
  );
  const { data: exams } = trpc.exam.getMany.useQuery(
    { doctorId: doctor?.id ?? 0 },
    { enabled: !!doctor }
  );
  const { mutateAsync: createExam } = trpc.exam.create.useMutation();
  const { data: appointments, refetch: refetchAppointments } =
    trpc.appointment.getMany.useQuery(
      {
        patientId: parseInt(patientId, 10),
        doctorId: doctor?.id,
      },
      { enabled: !!patientId }
    );
  const activeAppointment = appointments?.[0];

  const initialValues = {
    name: '',
  };

  const validate = z.object({
    name: z.string({ required_error: validations.required }),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!activeAppointment) {
      addToast({
        type: 'error',
        content:
          'Não foi encontrada uma consulta aberta para esse paciente, tente novamente em 5 segundos!',
      });
      refetchAppointments();
      return;
    }

    const [, error] = await tryCatch(
      createExam({
        ...values,
        appointmentId: activeAppointment?.id,
        doctorId: doctor?.id,
      })
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Falha ao solicitar esse exame!',
      });
      return;
    }

    router.push(paths.patientExams(patientId));
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
            name="name"
            hint={hints.required}
            label="Nome do Exame"
            options={
              exams?.map(({ name }) => ({
                text: name,
                value: name,
              })) ?? []
            }
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

export default FormExam;
