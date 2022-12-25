/* eslint no-console:off */
import { roles } from '@/constants/roles';
import { addHandbookToDoctor } from '@/db/doctors';
import {
  isAuthenticated,
  queryParamMatchesUid,
  requestTimer,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(isAuthenticated)
  .use(queryParamMatchesUid('doctorId', roles.master))
  .put(async (req, res) => {
    const { doctorId, handbookId } = req.query;

    const [, errorHandbookToDoctor] = await tryCatch(
      addHandbookToDoctor(doctorId as string, handbookId as string)
    );

    if (errorHandbookToDoctor)
      res.status(400).json({
        message: 'Failed to add handbook to doctor',
        error: errorHandbookToDoctor,
      });

    res.status(200).json({ message: 'Handbook added successfully!' });
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end('Server error!');
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ message: 'Invalid Request Method' });
  },
});
