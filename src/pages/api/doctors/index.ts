/* eslint no-console:off */
import { addDoctor } from '@/db/doctors';
import { onErrorHandler, onNoMatchHandler } from '@/helpers/api';
import { getCompleteDocumentData } from '@/helpers/firebase';
import {
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { doctorSchema } from '@/types/doctor';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(validateBody(doctorSchema))
  .use(isAuthenticated)
  .post(async (req, res) => {
    const { body } = req;

    const [data, error] = await tryCatch(addDoctor(body));

    if (error) {
      res.status(400).json({ message: 'Failed to create doctor', error });
    }

    const doctor = getCompleteDocumentData(await data?.get());

    res
      .status(200)
      .json({ message: 'Doctor successfully created!', data: doctor });
  });

export default router.handler({
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
});
