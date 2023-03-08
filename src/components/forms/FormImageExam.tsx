import { examTypes } from '@/constants/exams';
import hints from '@/constants/hints';
import paths from '@/constants/paths';
import validations from '@/constants/validations';
import tryCatch from '@/helpers/tryCatch';
import zodValidator from '@/helpers/zod-validator';
import { useActiveAppointment, useActiveDoctor } from '@/hooks';
import { putFileWithPresignedUrl } from '@/services/aws';
import { trpc } from '@/services/trpc';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { z } from 'zod';
import Button from '../core/Button';
import LoadingWrapper from '../core/LoadingWrapper';
import { useToast } from '../core/Toast';
import FormikAutocomplete from './FormikAutocomplete';
import FormikFile from './FormikFile';

const FormImageExam: FC = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const { data: doctor } = useActiveDoctor();
  const { data: activeAppointment } = useActiveAppointment({
    patientId: parseInt(patientId, 10),
  });
  const { data: exams, isLoading } = trpc.exam.getMany.useQuery(
    { doctorId: doctor?.id, type: examTypes.image },
    { enabled: !!doctor }
  );
  const { mutateAsync: createPresignedUrl } =
    trpc.exam.createPresignedUrl.useMutation();
  const { mutateAsync: createExam } = trpc.exam.create.useMutation();

  const initialValues = {
    name: '',
    image: null,
  };

  const validate = z.object({
    name: z.string({ required_error: validations.required }),
    image: z.instanceof(File, { message: validations.required }),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!values.image) return;
    if (!activeAppointment) {
      addToast({
        type: 'error',
        content: 'Não existe uma consulta aberta pra esse paciente!',
      });
      return;
    }

    const [imageData, errorGettingImageUrl] = await tryCatch(
      createPresignedUrl()
    );

    if (errorGettingImageUrl || !imageData) {
      addToast({
        type: 'error',
        content: 'Ocorreu um erro ao criar o link da imagem!',
      });
      return;
    }

    const [, errorUploadingImage] = await tryCatch(
      putFileWithPresignedUrl(imageData.presignedUrl, values.image)
    );

    if (errorUploadingImage) {
      addToast({
        type: 'error',
        content: 'Ocorreu um erro ao salvar a imagem!',
      });
      return;
    }

    const [, error] = await tryCatch(
      createExam({
        appointmentId: activeAppointment.id,
        name: values.name,
        imageUrl: imageData.url,
        type: examTypes.image,
      })
    );

    if (error) {
      addToast({
        type: 'error',
        content: 'Falha ao salvar o exame!',
      });
      return;
    }

    router.push(paths.patientImageExams(patientId));
  };

  return (
    <LoadingWrapper loading={isLoading}>
      <Formik
        initialValues={initialValues}
        validate={zodValidator(validate)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-y-6">
            <FormikAutocomplete
              label="Nome do Exame"
              hint={hints.required}
              name="name"
              options={
                exams?.map(({ name }) => ({
                  text: name,
                  value: name,
                })) ?? []
              }
            />
            <FormikFile name="image" label="Arquivo" variant="secondary">
              Escolha uma imagem
            </FormikFile>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Salvar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoadingWrapper>
  );
};

export default FormImageExam;
