/* eslint no-console:off */
import { appointmentStatus } from '@/constants/appointment-status';
import tryCatch from '@/helpers/tryCatch';
import { prisma } from '@/services/prisma';
import { addDays } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>().use(
  async (req, res, next) => {
    const start = Date.now();
    await next(); // call next in chain
    const end = Date.now();
    console.log(`Request took ${end - start}ms`);
  }
);

const ARCHIVE_APPOINTMENTS_KEY = process.env.ARCHIVE_APPOINTMENTS_KEY ?? '';

router.post(async (req, res) => {
  if (req.headers.archive_appointments_key !== ARCHIVE_APPOINTMENTS_KEY)
    return res
      .status(403)
      .json({ error: "You don't have permission to do this!" });

  const [archivedAppointments, error] = await tryCatch(
    prisma.appointment.updateMany({
      where: {
        status: appointmentStatus.finished,
        createdAt: {
          lte: addDays(new Date(), -1),
        },
      },
      data: {
        status: appointmentStatus.archived,
      },
    })
  );

  if (error)
    return res.status(400).json({ error: 'Failed to archive appointments!' });

  return res
    .status(200)
    .json({ message: `Successfully archived ${archivedAppointments?.count}` });
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});
