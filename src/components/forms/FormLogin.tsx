import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Card from '@/components/core/Card';
import Text from '@/components/core/Text';
import FormikInput from '@/components/forms/FormikInput';
import Button from '@/components/core/Button';
import validations from '@/constants/validations';

interface Props {
  title?: string;
}

const FormLogin = ({ title }: Props) => {
  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email(validations.email).required(validations.required),
  });

  const handleSubmit = async ({ email }: typeof initialValues) => {
    console.log(email);
  };

  return (
    <Card shadow className="w-5/6 max-w-sm">
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
            placeholder="exemplo@exemplo.com"
          />
          <Button type="submit" className="w-full mt-4">
            Enviar
          </Button>
        </Form>
      </Formik>
    </Card>
  );
};

export default FormLogin;
