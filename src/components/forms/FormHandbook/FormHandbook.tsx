import Button from '@/components/core/Button';
import { useToast } from '@/components/core/Toast';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { trpc } from '@/services/trpc';
import { FieldValue } from '@/types/handbook';
import type {
  Handbook,
  HandbookField,
  HandbookFieldOption,
} from '@prisma/client';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { z } from 'zod';
import FormikSelect from '../FormikSelect';
import HandbookFields from './HandbookFields';

type FormHandbookType =
  | Handbook & {
      fields: (HandbookField & {
        options: HandbookFieldOption[];
      })[];
    };

type Props = {
  handbook?: FormHandbookType | null;
  appointmentId?: number;
};

const FormHandbook: FC<Props> = ({ handbook, appointmentId }) => {
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
  const { mutateAsync: createHandbook } = trpc.handbook.create.useMutation();
  const { mutateAsync: updateHandbook } = trpc.handbook.update.useMutation();

  const initialValues = {
    selectedHandbookId: 0,
    handbook: (handbook ?? {
      id: 0,
      title: '',
      fields: [],
    }) as FormHandbookType,
  };

  const validate = z.object({
    selectedHandbookId: z.number().refine(
      (val) => {
        if (!appointmentId) return true;
        return val > 0;
      },
      {
        message: validations.required,
      }
    ),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const { id, ...filteredHandbook } = values.handbook;
    const valuesCopy = {
      ...filteredHandbook,
      ...(appointmentId && { appointmentId }),
      ...(handbook && { id }),
      fields:
        values.handbook?.fields.map((field) => {
          const { handbookId, id: fieldId, ...rest } = field;
          return {
            ...rest,
            ...(!!handbook && { id: fieldId }),
            value: (field.value as FieldValue) ?? undefined,
            options: field.options.map((option) => {
              const { id: optionId, ...optionWithoutId } = option;
              return {
                ...optionWithoutId,
              };
            }),
          };
        }) ?? [],
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
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validate)}
      onSubmit={handleSubmit}
    >
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
  );
};

export default FormHandbook;
