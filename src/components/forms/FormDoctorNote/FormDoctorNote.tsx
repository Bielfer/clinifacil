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
import Button from '@/components/core/Button';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import { useToast } from '@/components/core/Toast';
import FormikDate from '@/components/forms/FormikDate';
import FormikNumber from '@/components/forms/FormikNumber';
import FormikTextarea from '@/components/forms/FormikTextarea';
import ChangeMessageDynamically from './ChangeMessageDynamically';

const FormDoctorNote: FC = () => {
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
  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    refetch: refetchAppointments,
  } = trpc.appointment.getMany.useQuery(
    {
      patientId: parseInt(patientId, 10),
      doctorId: doctor?.id,
    },
    { enabled: !!patientId }
  );
  const { mutateAsync: createDoctorNote } =
    trpc.doctorNote.create.useMutation();
  const activeAppointment = appointments?.[0];

  const initialValues = {
    message: '',
    startDate: new Date(),
    duration: 0,
  };

  const validate = z.object({
    message: z.string({ required_error: validations.required }),
    startDate: z.date({ required_error: validations.required }),
    duration: z
      .number({ required_error: validations.required })
      .min(1, validations.minValue(0)),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!activeAppointment) {
      refetchAppointments();
      addToast({
        type: 'error',
        content:
          'Houve algum problema ao criar a receita, tente novamente em 5 segundos!',
      });
      return;
    }

    const [, error] = await tryCatch(
      createDoctorNote({
        ...values,
        appointmentId: activeAppointment.id,
      })
    );

    if (error) {
      addToast({
        type: 'error',
        content:
          'Houve algum problema ao criar a receita, tente novamente em 5 segundos!',
      });
      return;
    }

    router.push(paths.patientDoctorNotes(patientId));
  };

  return (
    <LoadingWrapper loading={isLoadingAppointments}>
      <Formik
        initialValues={initialValues}
        validate={zodValidator(validate)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-y-6">
            <FormikDate
              name="startDate"
              label="Data de Início do Atestado"
              hint={hints.required}
            />
            <FormikNumber
              name="duration"
              label="Duração do Atestado"
              hint={hints.required}
            />
            <FormikTextarea
              name="message"
              label="Conteúdo do Atestado"
              hint={hints.required}
              rows={4}
            />
            <ChangeMessageDynamically patient={activeAppointment?.patient} />

            <div className="flex items-center justify-end">
              <Button variant="primary" type="submit" loading={isSubmitting}>
                Criar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormDoctorNote;
