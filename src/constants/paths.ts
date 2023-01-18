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
  patientDoctorNotes: (patientId: string | number) =>
    `/patients/${patientId}/doctor-notes`,
  newPatientDoctorNotes: (patientId: string | number) =>
    `/patients/${patientId}/doctor-notes/new`,
  specificPatientAppointments: (patientId: string | number) =>
    `/patients/${patientId}/appointments`,
  allPatientAppointments: (patientId: string | number) =>
    `/patients/${patientId}/all-appointments`,
} as const;

export const sidebarPaths = [
  { text: 'Fila', href: paths.queue, icon: TicketIcon },
  { text: 'Pacientes', href: paths.patients, icon: UsersIcon },
] as const;

export const patientAppointmentPaths = ({
  patientId,
}: {
  patientId: string;
}) => [
  { text: 'Prontuário', href: paths.patientHandbooks(patientId) },
  { text: 'Receitas', href: paths.patientsById(patientId) },
  { text: 'Atestados', href: paths.patientDoctorNotes(patientId) },
];

export default paths;
