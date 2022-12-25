/* eslint no-console:off */
import {
  isAuthenticated,
  queryParamMatchesUid,
  requestTimer,
} from '@/helpers/middlewares';
import { onErrorHandler, onNoMatchHandler } from '@/helpers/api';
import { NextApiRequestExtended } from '@/types/api';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import tryCatch from '@/helpers/tryCatch';
import { getDoctorHandbooks } from '@/db/doctors';
import { Handbook } from '@/types/handbook';
import { getCompleteDocumentData } from '@/helpers/firebase';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(isAuthenticated)
  .use(queryParamMatchesUid('doctorId'))
  .get(async (req, res) => {
    const { doctorId } = req.query;
    const [snapshots, error] = await tryCatch(
      getDoctorHandbooks(doctorId as string)
    );

    if (error)
      res.status(400).json({ message: 'Failed to get appointments', error });

    const handbooks: Handbook[] = [];

    snapshots?.forEach((snapshot) =>
      handbooks.push(getCompleteDocumentData<Handbook>(snapshot))
    );

    res
      .status(200)
      .json({ message: 'Found doctor handbooks', data: handbooks });
  });

export default router.handler({
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
});
