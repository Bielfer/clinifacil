import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { trpc } from '@/services/trpc';
import type { Patient } from '@prisma/client';
import clsx from 'clsx';
import { format, parse } from 'date-fns';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { validateCPF } from 'validations-br';
import { z } from 'zod';
import Button from '@/components/core/Button';
import { useToast } from '@/components/core/Toast';
import FormikInput from '@/components/forms/FormikInput';
import FormikSelect from '@/components/forms/FormikSelect';
import SearchPatientByCpf from './SearchPatientByCpf';

type Props = {
  className?: string;
  patient?: Patient | null;
};

const FormPatient = ({ className, patient }: Props) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { mutateAsync: createPatient } = trpc.patient.create.useMutation();
  const { mutateAsync: editPatient } = trpc.patient.editById.useMutation();

  const initialValues = {
    cpf: patient?.cpf ?? '',
    name: patient?.name ?? '',
    birthDate: patient?.birthDate ? format(patient.birthDate, 'ddMMyyyy') : '',
    sex: patient?.sex ?? '',
    email: patient?.email ?? '',
    cellphone: patient?.cellphone ?? '',
  } as z.infer<typeof validationSchema>;

  const validationSchema = z.object({
    cpf: z
      .string({ required_error: validations.required })
      .length(11, validations.exactCharacters(11))
      .refine((arg) => validateCPF(arg), validations.cpf)
      .optional(),
    name: z.string({ required_error: validations.required }),
    birthDate: z
      .string({ required_error: validations.required })
      .length(8, validations.exactCharacters(8)),
    sex: z.enum(['Masculino', 'Feminino', ''], {
      errorMap: () => ({ message: validations.required }),
    }),
    email: z.string().email(validations.email).optional(),
    cellphone: z.string().length(11, validations.cellphone).optional(),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const valuesCopy = {
      ...values,
      birthDate: parse(values.birthDate, 'ddMMyyyy', new Date()),
      sex: (values.sex || undefined) as 'Masculino' | 'Feminino' | undefined,
    };

    if (patient) {
      const [updatedPatient] = await tryCatch(
        editPatient({ ...valuesCopy, id: patient.id })
      );

      if (!updatedPatient) {
        addToast({
          type: 'error',
          content: 'Falha ao atualizar o paciente, tente novamente!',
        });
        return;
      }

      router.push(paths.patientsById(patient.id));
      return;
    }

    const [createdPatient] = await tryCatch(createPatient(valuesCopy));

    if (!createdPatient) {
      addToast({ type: 'error', content: 'Falha ao criar o paciente!' });
      return;
    }

    router.push(paths.newPatientAppointment(createdPatient.id));
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={zodValidator(validationSchema)}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={clsx('flex flex-col gap-y-3', className)}>
          <FormikInput
            label="CPF"
            name="cpf"
            placeholder="Ex: 123.456.789-10"
            formatter="___.___.___-__"
            disabled={!!patient}
          />
          {!patient && <SearchPatientByCpf />}
          <FormikInput
            label="Nome"
            name="name"
            hint={hints.required}
            placeholder="Ex: João da Silva"
            disabled={!!patient}
          />
          <FormikInput
            label="Data de Nascimento"
            name="birthDate"
            placeholder="Ex: 13/06/1997"
            formatter="__/__/____"
            hint={hints.required}
            disabled={!!patient}
          />
          <FormikSelect
            label="Sexo"
            name="sex"
            options={[
              { text: 'Masculino', value: 'Masculino' },
              { text: 'Feminino', value: 'Feminino' },
            ]}
            hint={hints.required}
            disabled={!!patient}
          />
          <FormikInput
            label="Email"
            name="email"
            placeholder="Ex: joaodasilva@gmail.com"
          />
          <FormikInput
            label="Celular"
            name="cellphone"
            placeholder="Ex: (11) 91234 - 5678"
            formatter="(__) _____ - ____"
          />

          <div className="mt-2 flex justify-end">
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Salvar
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default FormPatient;
