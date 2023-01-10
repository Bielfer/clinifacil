import { TicketIcon, UsersIcon } from '@heroicons/react/24/outline';

const paths = {
  home: '/',
  pricing: '/#pricing',
  features: '/#features',
  login: '/login',
  queue: '/queue',
  patients: '/patients',
  newPatient: '/patients/new',
  patientsById: (patientId: string | number) => `/patients/${patientId}`,
  editPatient: (patientId: string | number) => `/patients/${patientId}/edit`,
  patientHandbooks: (patientId: string | number) =>
    `/patients/${patientId}/handbooks`,
  newPatientHandbook: (patientId: string | number) =>
    `/patients/${patientId}/handbooks/new`,
  patientHandbookById: ({
    patientId,
    handbookId,
  }: {
    patientId: string | number;
    handbookId: string | number;
  }) => `/patients/${patientId}/handbooks/${handbookId}`,
  specificPatientAppointments: (patientId: string | number) =>
    `/patients/${patientId}/appointments`,
  allPatientAppointments: (patientId: string | number) =>
    `/patients/${patientId}/all-appointments`,
} as const;

export const sidebarPaths = [
  { text: 'Fila', href: paths.queue, icon: TicketIcon },
  { text: 'Pacientes', href: paths.patients, icon: UsersIcon },
] as const;

export default paths;
