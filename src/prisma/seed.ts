/* eslint no-console:off */
import { prisma } from '../services/prisma';

const connectAppointmentsToAppointmentType = async () => {
  const appointments = await prisma.appointment.findMany();
  const appointmentTypes = await prisma.appointmentType.findMany({
    select: {
      name: true,
      price: true,
    },
  });

  appointments.forEach(async (appointment, idx) => {
    await prisma.appointment.update({
      where: {
        id: appointment.id,
      },
      data: {
        type: {
          create: appointmentTypes[idx % 2],
        },
      },
    });
  });
};

const main = async () => {
  await connectAppointmentsToAppointmentType();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
