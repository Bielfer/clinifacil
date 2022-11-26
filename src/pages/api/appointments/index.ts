/* eslint no-console:off */
import { addAppointment, getAppointments } from '@/db/appointments';
import { onErrorHandler, onNoMatchHandler } from '@/helpers/api';
import { getCompleteDocumentData } from '@/helpers/firebase';
import {
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { Appointment, appointmentSchema } from '@/types/appointment';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router.use(isAuthenticated).get(async (req, res) => {
  const { query } = req;

  const [snapshots, error] = await tryCatch(getAppointments(query));

  if (error)
    res.status(400).json({ message: 'Failed to get appointments', error });

  const appointments: Appointment[] = [];

  snapshots?.forEach((snapshot) =>
    appointments.push(getCompleteDocumentData<Appointment>(snapshot))
  );

  res.status(200).json({
    message: 'Appointments found!',
    data: appointments,
  });
});

router
  .use(validateBody(appointmentSchema))
  .use(isAuthenticated)
  .post(async (req, res) => {
    const { body } = req;

    const [data, error] = await tryCatch(addAppointment(body));

    if (error) {
      res.status(400).json({ message: 'Failed to create appointment', error });
    }

    const appointment = getCompleteDocumentData(await data?.get());

    res.status(200).json({
      message: 'Appointment successfully created!',
      data: appointment,
    });
  });

export default router.handler({
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
});
