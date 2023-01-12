import { fieldValue } from '@/server/routers/handbook';
import { z } from 'zod';

export type FieldValue = z.infer<typeof fieldValue>;
