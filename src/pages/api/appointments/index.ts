/* eslint no-console:off */
import { addAppointment } from '@/db/appointments';
import {
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { appointmentSchema } from '@/types/appointment';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(validateBody(appointmentSchema))
  .use(isAuthenticated)
  .post(async (req, res) => {
    const { body } = req;

    const [data, error] = await tryCatch(addAppointment(body));

    if (error) {
      res.status(400).json({ message: 'Failed to create appointment', error });
    }

    const appointmentDoc = await data?.get();
    const appointmentData = appointmentDoc?.data();
    const appointment = {
      ...appointmentData,
      id: appointmentDoc?.id,
      updatedAt: appointmentDoc?.updateTime?.toDate(),
      createdAt: appointmentDoc?.createTime?.toDate(),
    };

    res.status(200).json({
      message: 'Appointment successfully created!',
      data: appointment,
    });
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
