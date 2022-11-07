import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Card from '@/components/core/Card';
import Text from '@/components/core/Text';
import FormikInput from '@/components/forms/FormikInput';
import Button from '@/components/core/Button';
import validations from '@/constants/validations';
import { useAuth } from '@/contexts/auth';
import tryCatch from '@/helpers/tryCatch';
import { useRouter } from 'next/router';
import paths from '@/constants/paths';
import { useToast } from '../core/Toast';

interface Props {
  title?: string;
}

const FormLogin = ({ title }: Props) => {
  const router = useRouter();
  const { addToast } = useToast();
  const { signInEmailAndPassword } = useAuth();

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(validations.email).required(validations.required),
    password: Yup.string()
      .min(6, validations.minCharacters(6))
      .required(validations.required),
  });

  const handleSubmit = async ({ email, password }: typeof initialValues) => {
    const [, error] = await tryCatch(signInEmailAndPassword(email, password));

    if (error) {
      addToast({ type: 'error', content: error });
      return;
    }

    router.push(paths.records);
  };

  return (
    <Card shadow className="w-5/6 max-w-sm p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Text h3 className="mb-4">
            {title || 'Faça seu Login'}
          </Text>
          <FormikInput
            name="email"
            label="Email"
            placeholder="Ex: meuemail@provedor.com"
          />
          <FormikInput
            name="password"
            label="Senha"
            placeholder="Ex: minhasenha123"
            password
          />
          <div className="flex justify-end mt-4">
            <Button type="submit" variant="primary">
              Entrar
            </Button>
          </div>
        </Form>
      </Formik>
    </Card>
  );
};

export default FormLogin;
