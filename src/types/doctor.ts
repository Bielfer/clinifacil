import { z } from 'zod';

export const doctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    cpf: z.string(),
    crm: z.string(),
    email: z.string().optional(),
    cellphone: z.string().optional(),
  })
  .strict();

export type Doctor = z.infer<typeof doctorSchema>;
