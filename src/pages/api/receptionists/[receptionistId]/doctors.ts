/* eslint no-console:off */
import { roles } from '@/constants/roles';
import { getDoctorsById } from '@/db/doctors';
import { getReceptionistById } from '@/db/receptionist';
import { isAuthenticated, requestTimer } from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { Doctor } from '@/types/doctor';
import { Receptionist } from '@/types/receptionist';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router.use(isAuthenticated).get(async (req, res) => {
  const { token } = req;
  const { receptionistId } = req.query;

  if (receptionistId !== token?.uid && !token?.roles?.includes(roles.master))
    res.status(403).json({
      message: 'Failed to get receptionist',
      error: "You don't have permission to access this content",
    });

  const [receptionistDoc, errorReceptionist] = await tryCatch(
    getReceptionistById(receptionistId as string)
  );

  if (errorReceptionist)
    res.status(400).json({
      message: 'Failed to get receptionist',
      error: errorReceptionist,
    });

  const receptionist = receptionistDoc?.data() as unknown as Receptionist;
  const doctorIds = Object.keys(receptionist.doctors);

  const [snapshots, errorDoctors] = await tryCatch(getDoctorsById(doctorIds));

  if (errorDoctors)
    res
      .status(400)
      .json({ message: 'Failed to get doctors', error: errorDoctors });

  const doctors: Doctor[] = [];

  snapshots?.forEach((snapshot) => {
    const doctorData = snapshot.data();

    doctors.push({
      ...doctorData,
      id: snapshot.id,
      updatedAt: snapshot.updateTime.toDate(),
      createdAt: snapshot.updateTime.toDate(),
    } as Doctor);
  });

  res.status(200).json({
    message: 'Successfully found receptionist doctors',
    data: doctors,
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
