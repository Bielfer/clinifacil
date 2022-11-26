/* eslint no-console:off */
import { addPatient } from '@/db/patients';
import { onErrorHandler, onNoMatchHandler } from '@/helpers/api';
import { getCompleteDocumentData } from '@/helpers/firebase';
import {
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { patientSchema } from '@/types/patient';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(validateBody(patientSchema))
  .use(isAuthenticated)
  .post(async (req, res) => {
    const { body } = req;

    const [data, error] = await tryCatch(addPatient(body));

    if (error) {
      res.status(400).json({ message: 'Failed to create patient', error });
    }

    const patient = getCompleteDocumentData(await data?.get());

    res
      .status(200)
      .json({ message: 'Patient successfully created!', data: patient });
  });

export default router.handler({
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
});
