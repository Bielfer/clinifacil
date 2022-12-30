import { z } from 'zod';

const receptionistDoctor = z.object({
  id: z.number(),
  name: z.string().optional(),
});

export const receptionistSchema = z.object({
  id: z.number(),
  name: z.string(),
  doctors: receptionistDoctor.array().nonempty(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Receptionist = z.infer<typeof receptionistSchema>;
