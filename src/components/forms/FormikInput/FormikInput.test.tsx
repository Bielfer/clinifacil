import { render, screen, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import userEvent from '@testing-library/user-event';
import FormikInput from '.';

describe('FormikInput', () => {
  const handleSubmit = jest.fn();

  const validationSchema = Yup.object({
    test: Yup.string().required('required'),
  });

  const Input = (
    <Formik
      initialValues={{ test: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormikInput label="test" name="test" />
    </Formik>
  );

  const InputWithButton = (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ test: '' }}
      validationSchema={validationSchema}
    >
      {({ submitForm }) => (
        <Form>
          <FormikInput label="test" name="test" />
          <button
            type="submit"
            onClick={() => {
              submitForm();
            }}
          >
            test
          </button>
        </Form>
      )}
    </Formik>
  );

  const InputWithFormatter = (
    <Formik
      initialValues={{ test: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <FormikInput label="test" name="test" formatter="___.___.___-__" />
    </Formik>
  );

  it('matches snapshot', () => {
    const { asFragment } = render(Input);

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders the input', () => {
    render(Input);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays error message, submit after correction', async () => {
    render(InputWithButton);

    await waitFor(() => userEvent.click(screen.getByRole('button')));

    expect(await screen.findByText('required')).toBeInTheDocument();

    await waitFor(() => userEvent.type(screen.getByRole('textbox'), 't'));
    await waitFor(() => userEvent.click(screen.getByRole('button')));

    expect(handleSubmit).toHaveBeenCalled();
  });

  it('should be able to format the text', async () => {
    render(InputWithFormatter);

    const InputElement = screen.getByRole('textbox');

    await waitFor(() => userEvent.type(InputElement, '99999999999'));

    expect(InputElement).toHaveValue('999.999.999-99');
  });
});
