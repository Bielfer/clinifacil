import { z } from 'zod';

const doctorReceptionist = z.object({ id: z.number(), name: z.string() });

export const doctorSchema = z.object({
  id: z.number(),
  name: z.string(),
  cpf: z.string(),
  crm: z.string(),
  email: z.string().optional(),
  cellphone: z.string().optional(),
  receptionists: doctorReceptionist.array().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Doctor = z.infer<typeof doctorSchema>;
