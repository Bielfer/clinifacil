import { z } from 'zod';

export const patientSchema = z.object({
  id: z.number(),
  name: z.string(),
  birthDate: z.date().optional(),
  sex: z.enum(['Masculino', 'Feminino']).optional(),
  cpf: z.string().length(11).optional(),
  email: z.string().email().optional(),
  cellphone: z.string().max(11).min(10).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Patient = z.infer<typeof patientSchema>;
