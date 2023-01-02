import { z } from 'zod';

const zodValidator =
  <T extends z.ZodTypeAny>(schema: T) =>
  (values: any) => {
    const parse = schema.safeParse(values);

    if (parse.success) return {};

    const { fieldErrors } = parse.error.flatten();
    const errors: Record<string, any> = {};

    Object.keys(fieldErrors).forEach((errorKey) => {
      errors[errorKey] = fieldErrors[errorKey]?.[0];
    });

    return errors;
  };

export default zodValidator;
