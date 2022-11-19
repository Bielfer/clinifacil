/* eslint no-console:off */
import { addPatient } from '@/db/patients';
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

    const patientDoc = await data?.get();
    const patientData = patientDoc?.data();
    const patient = {
      ...patientData,
      id: patientDoc?.id,
      updatedAt: patientDoc?.updateTime?.toDate(),
      createdAt: patientDoc?.createTime?.toDate(),
    };

    res
      .status(200)
      .json({ message: 'Patient successfully created!', data: patient });
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
