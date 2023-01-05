import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { useRoles } from '@/hooks';
import { trpc } from '@/services/trpc';
import useReceptionistStore from '@/store/receptionist';
import { Patient } from '@prisma/client';
import { format, parse } from 'date-fns';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import Button from '../core/Button';
import Card from '../core/Card';
import { useToast } from '../core/Toast';
import FormikInput from './FormikInput';
import FormikSelect from './FormikSelect';

type Props = {
  className?: string;
  patient?: Patient | null;
};

const FormPatient = ({ className, patient }: Props) => {
  const router = useRouter();
  const { isDoctor } = useRoles();
  const { data: session } = useSession();
  const { addToast } = useToast();
  const { mutateAsync: createPatient, isError: errorCreatingPatient } =
    trpc.patient.create.useMutation();
  const { mutateAsync: createAppointment, isError: errorCreatingAppointment } =
    trpc.appointment.create.useMutation();
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );
  const { data: doctor } = trpc.doctor.get.useQuery(
    { userId: session?.user.id },
    { enabled: isDoctor }
  );

  const initialValues = {
    cpf: patient?.cpf ?? '',
    name: patient?.name ?? '',
    birthDate: format(patient?.birthDate ?? new Date(), 'ddMMyyyy') ?? '',
    sex: patient?.sex ?? '',
    email: patient?.email ?? '',
    cellphone: patient?.cellphone ?? '',
  } as z.infer<typeof validationSchema>;

  const validationSchema = z.object({
    cpf: z
      .string({ required_error: validations.required })
      .length(11, validations.exactCharacters(11)),
    name: z.string({ required_error: validations.required }),
    birthDate: z.string({ required_error: validations.required }),
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

    const [createdPatient] = await tryCatch(createPatient(valuesCopy));

    if (errorCreatingPatient || !createdPatient) {
      addToast({ type: 'error', content: 'Falha ao criar o paciente!' });
      return;
    }

    await tryCatch(
      createAppointment({
        doctorId: (isDoctor ? doctor?.id : selectedDoctorId) ?? 0,
        patientId: createdPatient.id,
      })
    );

    if (errorCreatingAppointment) {
      router.push(paths.patients);
      return;
    }

    router.push(paths.queue);
  };

  return (
    <Card className={className}>
      <Formik
        initialValues={initialValues}
        validate={zodValidator(validationSchema)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-y-3">
            <FormikInput
              label="CPF"
              name="cpf"
              placeholder="Ex: 123.456.789-10"
              formatter="___.___.___-__"
              hint={hints.required}
            />
            <FormikInput
              label="Nome"
              name="name"
              hint={hints.required}
              placeholder="Ex: João da Silva"
            />
            <FormikInput
              label="Data de Nascimento"
              name="birthDate"
              placeholder="Ex: 13/06/1997"
              formatter="__/__/____"
              hint={hints.required}
            />
            <FormikSelect
              label="Sexo"
              name="sex"
              options={[
                { text: 'Masculino', value: 'Masculino' },
                { text: 'Feminino', value: 'Feminino' },
              ]}
              hint={hints.required}
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
                Criar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};
export default FormPatient;
