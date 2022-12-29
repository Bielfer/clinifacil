import { roles } from '@/constants/roles';
import tryCatch from '@/helpers/tryCatch';
import { privateProcedure, router } from '@/server/trpc';
import { prisma } from '@/services/prisma';
import { patientSchema } from '@/types/patient';
import { TRPCError } from '@trpc/server';
import { authorizeHigherOrEqualRole } from '../middlewares';

export const patientRouter = router({
  create: privateProcedure
    .use(authorizeHigherOrEqualRole(roles.receptionist))
    .input(patientSchema.omit({ id: true }))
    .mutation(async ({ input }) => {
      const [patient, error] = await tryCatch(
        prisma.patient.create({
          data: input,
        })
      );

      if (error) throw new TRPCError({ code: 'BAD_REQUEST' });

      return patient;
    }),
});

export type PatientRouter = typeof patientRouter;
