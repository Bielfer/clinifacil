import { TicketIcon, UsersIcon } from '@heroicons/react/24/outline';

const paths = {
  home: '/',
  pricing: '/#pricing',
  features: '/#features',
  login: '/login',
  queue: '/queue',
  patients: '/patients',
  newPatient: '/patients/new',
  patientsById: (id: number) => `/patients/${id}`,
} as const;

export const sidebarPaths = [
  { text: 'Fila', href: paths.queue, icon: TicketIcon },
  { text: 'Pacientes', href: paths.patients, icon: UsersIcon },
] as const;

export default paths;
