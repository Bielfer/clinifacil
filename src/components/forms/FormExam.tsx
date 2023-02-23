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
import FormikAdd from './FormikAdd';

const FormExam: FC = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const { data: doctor } = useActiveDoctor();
  const { data: exams } = trpc.exam.getMany.useQuery(
    { doctorId: doctor?.id ?? 0 },
    { enabled: !!doctor }
  );
  const { mutateAsync: createExam } = trpc.exam.create.useMutation();
  const { data: activeAppointment, refetch: refetchAppointment } =
    useActiveAppointment({ patientId: parseInt(patientId, 10) });

  const initialValues = {
    exams: [],
  };

  const validate = z.object({
    exams: z.string().array().min(1, validations.minOptions(1)),
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
      createExam(
        values.exams.map((exam) => ({
          name: exam,
          appointmentId: activeAppointment.id,
        }))
      )
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
          <FormikAdd
            label="Nome do Exame"
            hint={hints.required}
            name="exams"
            component="autocomplete"
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
