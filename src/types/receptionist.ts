import { z } from 'zod';

export const receptionistSchema = z
  .object({
    id: z.string().optional(),
    name: z.string(),
    doctors: z.record(z.boolean()),
  })
  .strict();

export type Receptionist = z.infer<typeof receptionistSchema>;
