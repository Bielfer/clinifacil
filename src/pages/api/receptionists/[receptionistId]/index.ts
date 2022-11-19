/* eslint no-console:off */
import { updateReceptionist } from '@/db/receptionist';
import {
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { receptionistSchema } from '@/types/receptionist';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(validateBody(receptionistSchema))
  .use(isAuthenticated)
  .patch(async (req, res) => {
    const { receptionistId } = req.query;

    const { cpf, name, ...filteredBody } = req.body;

    const [data, error] = await tryCatch(
      updateReceptionist(receptionistId as string, filteredBody)
    );

    if (error) {
      res.status(400).json({ message: 'Failed to update doctor', error });
    }

    res.status(200).json({ message: 'Doctor successfully updated!', data });
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
