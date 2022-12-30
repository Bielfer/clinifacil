import { roles } from '@/constants/roles';
import { fieldTypesArray } from '@/constants/field-types';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole, isAuthorized } from '../middlewares';

const handbookFieldOptionSchema = z.object({
  text: z.string(),
  value: z.string(),
});

const handbookFieldTypeSchema = z.enum(fieldTypesArray);

const handbookFieldSchema = z.object({
  label: z.string(),
  type: handbookFieldTypeSchema,
  value: z
    .union([z.string(), z.boolean(), z.date()])
    .transform((val) => {
      if (val instanceof Date) return val.toString();

      return val;
    })
    .optional(),
  required: z.boolean().optional(),
  options: handbookFieldOptionSchema.array().nonempty().optional(),
});

export const handbookSchema = z.object({
  title: z.string(),
  fields: handbookFieldSchema.array().nonempty(),
  doctorId: z.number().optional(),
});

export const handbookRouter = router({
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .use(isAuthorized({ inputKey: 'doctorId' }))
    .input(handbookSchema)
    .mutation(async ({ input }) => {
      const { title, fields, doctorId } = input;

      const formattedFields = fields.map((field) => ({
        ...field,
        value: field.value,
        options: {
          create: field.options,
        },
      }));

      const [handbook, error] = await tryCatch(
        prisma.handbook.create({
          data: {
            title,
            fields: {
              create: formattedFields,
            },
            doctors: {
              connect: doctorId ? [{ id: doctorId }] : [],
            },
          },
          include: {
            fields: {
              include: {
                options: true,
              },
            },
          },
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return handbook;
    }),
});
