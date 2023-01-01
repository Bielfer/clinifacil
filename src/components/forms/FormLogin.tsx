import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Card from '@/components/core/Card';
import Text from '@/components/core/Text';
import FormikInput from '@/components/forms/FormikInput';
import Button from '@/components/core/Button';
import validations from '@/constants/validations';
import axios from 'axios';
import { useState } from 'react';
import { useToast } from '../core/Toast';

interface Props {
  title?: string;
  csrfToken?: string;
}

const FormLogin = ({ title, csrfToken }: Props) => {
  const { addToast } = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const initialValues = {
    email: '',
    csrfToken,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(validations.email).required(validations.required),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    const res = await axios.post('/api/auth/signin/email', values);

    if (res.status !== 200) {
      addToast({
        type: 'error',
        content: 'Verifique se o seu email está correto!',
      });
      return;
    }

    setEmailSent(true);
  };

  return (
    <Card shadow className="w-5/6 max-w-sm p-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) =>
          !emailSent ? (
            <Form>
              <Text h3 className="mb-4">
                {title || 'Faça seu Login'}
              </Text>
              <FormikInput
                name="email"
                label="Email"
                placeholder="Ex: meuemail@provedor.com"
              />
              <div className="mt-4 flex justify-end">
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  Entrar
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <Text h4 className="mb-4">
                Acabamos de enviar um link para seu email!
              </Text>
              <div className="flex justify-center">
                <Button
                  variant="link-primary"
                  onClick={() => handleSubmit(values)}
                >
                  Clique aqui para enviar outro link!
                </Button>
              </div>
            </>
          )
        }
      </Formik>
    </Card>
  );
};

export default FormLogin;
