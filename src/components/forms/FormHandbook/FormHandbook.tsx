import Button from '@/components/core/Button';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import { useToast } from '@/components/core/Toast';
import paths from '@/constants/paths';
import tryCatch from '@/helpers/tryCatch';
import { trpc } from '@/services/trpc';
import type { HandbookField } from '@prisma/client';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import FormikSelect from '../FormikSelect';
import HandbookFields from './HandbookFields';

type FormHandbookType = {
  id: number;
  title: string;
  fields: (HandbookField & {
    value: string | number | Date | undefined;
    options: {
      id?: number;
      value: string;
      text: string;
    }[];
  })[];
};

type Props = {
  handbook?: FormHandbookType;
};

const FormHandbook: FC<Props> = ({ handbook }) => {
  const router = useRouter();
  const { addToast } = useToast();
  const patientId = router.query.patientId as string;
  const { data: session } = useSession();
  const { data: doctor } = trpc.doctor.get.useQuery({
    userId: session?.user.id,
  });
  const { data: handbooks } = trpc.doctor.handbooks.useQuery(
    {
      doctorId: doctor?.id,
      userId: session?.user.id,
    },
    { enabled: !!doctor }
  );
  const { data: appointments, isLoading: loadingAppointments } =
    trpc.appointment.getMany.useQuery(
      { patientId: parseInt(patientId, 10), doctorId: doctor?.id },
      { enabled: !handbook && !!doctor }
    );
  const { mutateAsync: createHandbook } = trpc.handbook.create.useMutation();
  const { mutateAsync: updateHandbook } = trpc.handbook.update.useMutation();

  const activeAppointment = appointments?.[0];

  const initialValues = {
    selectedHandbookId: 0,
    handbook: (handbook ?? {
      title: '',
      fields: [],
    }) as FormHandbookType,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const { id, ...filteredHandbook } = values.handbook;
    const valuesCopy = {
      ...filteredHandbook,
      ...(activeAppointment && { appointmentId: activeAppointment.id }),
      ...(handbook && { id }),
      fields: values.handbook.fields.map((field) => {
        const { handbookId, id: fieldId, ...rest } = field;
        return {
          ...rest,
          ...(!!handbook && { id: handbook.id }),
          value: field.value ?? undefined,
          options: field.options.map((option) => {
            const { id: optionId, ...optionWithoutId } = option;
            return {
              ...optionWithoutId,
            };
          }),
        };
      }),
    };

    let error: any;

    if (!handbook) {
      [, error] = await tryCatch(createHandbook(valuesCopy));
    } else {
      [, error] = await tryCatch(updateHandbook(valuesCopy));
    }

    if (error) {
      addToast({
        type: 'error',
        content: 'Falha ao salvar consulta, tente novamente em 5 segundos!',
        duration: 5000,
      });
      return;
    }

    router.push(paths.patientHandbooks(patientId));
  };

  return (
    <LoadingWrapper loading={loadingAppointments}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-y-6">
            {!handbook && (
              <FormikSelect
                name="selectedHandbookId"
                label="Tipo de Consulta"
                options={
                  handbooks?.map((doctorHandbook) => ({
                    text: doctorHandbook.title,
                    value: doctorHandbook.id,
                  })) ?? []
                }
              />
            )}
            <HandbookFields handbooks={handbooks ?? []} />
            <div className="flex justify-end">
              <Button type="submit" loading={isSubmitting} variant="primary">
                Salvar Consulta
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormHandbook;
