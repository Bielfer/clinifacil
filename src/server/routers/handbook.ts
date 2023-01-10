import { roles } from '@/constants/roles';
import { fieldTypesArray } from '@/constants/field-types';
import tryCatch from '@/helpers/tryCatch';
import { router, privateProcedure } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { authorizeHigherOrEqualRole, isAuthorized } from '../middlewares';

const handbookFieldOptionSchema = z.object({
  id: z.number().optional(),
  text: z.string(),
  value: z.string(),
});

const handbookFieldTypeSchema = z.enum(fieldTypesArray);

const fieldValue = z
  .union([z.string(), z.boolean(), z.date(), z.number()])
  .transform((val) => {
    if (val instanceof Date) return val.toString();

    return val;
  })
  .optional();

export const handbookFieldSchema = z.object({
  id: z.number().optional(),
  label: z.string(),
  type: handbookFieldTypeSchema,
  value: fieldValue,
  required: z.boolean().optional(),
  options: handbookFieldOptionSchema.array().optional(),
});

const handbookSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  fields: handbookFieldSchema.array(),
  doctorId: z.number().optional(),
  appointmentId: z.number().optional(),
});

export const handbookRouter = router({
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.doctor))
    .input(handbookSchema)
    .mutation(async ({ input }) => {
      const { fields, appointmentId, doctorId, id, ...filteredInput } = input;

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
            ...filteredInput,
            fields: {
              create: formattedFields,
            },
            ...(doctorId && {
              doctors: {
                connect: [{ id: doctorId }],
              },
            }),
            ...(appointmentId && {
              appointment: {
                connect: { id: appointmentId },
              },
            }),
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

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return handbook;
    }),
  update: privateProcedure
    .use(isAuthorized({ inputKey: 'userId' }))
    .input(
      handbookSchema.omit({
        doctorId: true,
        appointmentId: true,
      })
    )
    .mutation(async ({ input }) => {
      const { fields, ...filteredInput } = input;

      const [handbook, error] = await tryCatch(
        prisma.handbook.update({
          where: {
            id: filteredInput.id,
          },
          data: {
            ...filteredInput,
            fields: {
              update: fields.map((field) => {
                const { id, ...fieldWithoutId } = field;

                return {
                  where: {
                    id,
                  },
                  data: {
                    ...fieldWithoutId,
                    options: {
                      update: fieldWithoutId.options?.map((option) => {
                        const { id: optionId, ...optionWithoutId } = option;

                        return {
                          where: {
                            id: optionId,
                          },
                          data: optionWithoutId,
                        };
                      }),
                    },
                  },
                };
              }),
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

      if (error) throw new TRPCError({ code: 'BAD_REQUEST', message: error });

      return handbook;
    }),
});
