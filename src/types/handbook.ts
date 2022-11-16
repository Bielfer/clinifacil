import { z } from 'zod';

const handbookFieldOptionSchema = z.object({
  text: z.string(),
  value: z.string(),
});

const handbookFieldTypeSchema = z.enum([
  'text',
  'autocomplete',
  'check',
  'textarea',
  'date',
]);

const handbookFieldSchema = z
  .object({
    id: z.string(),
    label: z.string(),
    type: handbookFieldTypeSchema,
    value: z.union([z.string(), z.boolean()]),
    required: z.boolean().optional(),
    options: handbookFieldOptionSchema.array().optional(),
  })
  .strict();

export const handbookSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    fields: handbookFieldSchema.array(),
  })
  .strict();

export type Handbook = z.infer<typeof handbookSchema>;

export type HandbookField = z.infer<typeof handbookFieldSchema>;

export type HandbookFieldType = z.infer<typeof handbookFieldTypeSchema>;

export type HandbookFieldOption = z.infer<typeof handbookFieldOptionSchema>;
