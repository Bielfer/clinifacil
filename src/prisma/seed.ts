/* eslint no-console:off */
/* eslint @typescript-eslint/no-unused-vars:off */
import { handbookFieldSchema } from '@/server/routers/handbook';
import { AppointmentStatus, HandbookField } from '@prisma/client';
import { z } from 'zod';
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

const connectUserAndDoctor = async ({
  userId,
  doctorId,
}: {
  userId: string;
  doctorId: number;
}) => {
  await prisma.doctor.update({
    where: {
      id: doctorId,
    },
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: 'DOCTOR',
    },
  });
};

const createDoctorHandbook = async ({
  fields,
  doctorId,
  title,
}: {
  fields: z.infer<typeof handbookFieldSchema>[];
  doctorId: number;
  title: string;
}) => {
  const formattedFields = fields.map((field) => ({
    ...field,
    value: field.value,
    options: {
      create: field.options,
    },
  }));

  const handbook = await prisma.handbook.create({
    data: {
      title,
      fields: {
        create: formattedFields,
      },
      doctors: {
        connect: [{ id: doctorId }],
      },
    },
  });

  console.log(handbook);
};

const listLastDoctorHandbooks = async (doctorId: number) => {
  const handbooks = await prisma.handbook.findMany({
    where: {
      doctors: {
        some: {
          id: doctorId,
        },
      },
    },
    include: {
      fields: {
        include: { options: true },
      },
    },
    take: 5,
  });

  console.log(handbooks);
};

const createDoctorAppointmentTypes = async ({
  doctorId,
  appointmentTypes,
}: {
  doctorId: number;
  appointmentTypes: { name: string; price?: number }[];
}) => {
  const formattedAppointmentTypes = appointmentTypes.map((appointmentType) => ({
    ...appointmentType,
    doctorId,
  }));

  await prisma.appointmentType.createMany({
    data: formattedAppointmentTypes,
  });
};

const listDoctorAppointmentTypes = async (doctorId: number) => {
  const appointmentTypes = await prisma.appointmentType.findMany({
    where: {
      doctorId,
    },
  });

  console.log(appointmentTypes);
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
