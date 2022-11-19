import { z } from 'zod';

export const doctorSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    cpf: z.string(),
    crm: z.string(),
    email: z.string().optional(),
    cellphone: z.string().optional(),
    receptionists: z.record(z.boolean()).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict();

export type Doctor = z.infer<typeof doctorSchema>;
