/* eslint no-console:off */
/* eslint @typescript-eslint/no-unused-vars:off */
import { AppointmentStatus } from '@prisma/client';
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

const changeAppointmentsStatus = async (status: AppointmentStatus) => {
  await prisma.appointment.updateMany({
    where: {
      NOT: {
        status: 'ARCHIVED',
      },
    },
    data: {
      status,
    },
  });

  console.log('Appointments status updated');
};

const listLastFiveDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  console.log(doctors);
};

const listLastFiveUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
  });

  console.log(users);
};

const createDoctor = async () => {
  const doctor = await prisma.doctor.create({
    data: {
      name: '',
      cpf: '',
      crm: '',
      email: '',
      cellphone: '',
      city: '',
    },
  });

  console.log('Doctor created:', doctor);
};

const connectUserAndDoctor = async () => {
  await prisma.doctor.update({
    where: {
      id: 0,
    },
    data: {
      user: {
        connect: {
          id: '',
        },
      },
    },
  });
};

const main = async () => {};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
