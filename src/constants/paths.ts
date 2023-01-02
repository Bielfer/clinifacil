import { BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline';

const paths = {
  home: '/',
  pricing: '/#pricing',
  features: '/#features',
  login: '/login',
  queue: '/queue',
  patients: '/patients',
  patientsById: (id: string) => `/patients/${id}`,
} as const;

export const sidebarPaths = [
  { text: 'Fila', href: paths.queue, icon: UsersIcon },
  { text: 'Pacientes', href: paths.patients, icon: BookOpenIcon },
] as const;

export default paths;
