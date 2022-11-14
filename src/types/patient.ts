import { z } from 'zod';

export const patientSchema = z
  .object({
    name: z.string().optional(),
    birthDate: z.string().optional(),
    sex: z.string().optional(),
    cpf: z.string().length(11).optional(),
    email: z.string().email().optional(),
    cellphone: z.string().max(11).min(10).optional(),
  })
  .strict();

export type Patient = z.infer<typeof patientSchema>;
