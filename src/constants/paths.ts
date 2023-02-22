import {
  BanknotesIcon,
  TicketIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

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
  patientPrescriptions: (patientId: string | number) =>
    `/patients/${patientId}/prescriptions`,
  newPatientPrescriptions: (patientId: string | number) =>
    `/patients/${patientId}/prescriptions/new`,
  specificPatientAppointments: (patientId: string | number) =>
    `/patients/${patientId}/appointments`,
  allPatientAppointments: (patientId: string | number) =>
    `/patients/${patientId}/all-appointments`,
  newPatientAppointment: (patientId: string | number) =>
    `/patients/${patientId}/appointments/new`,
  appointmentsSummary: '/appointments/summary',
  patientExams: (patientId: string | number) => `/patients/${patientId}/exams`,
  newPatientExam: (patientId: string | number) =>
    `/patients/${patientId}/exams/new`,
  appointmentTypesByName: (typeName: string | number) =>
    `/appointments/types/${typeName}`,
} as const;

export const sidebarPaths = [
  { text: 'Fila', href: paths.queue, icon: TicketIcon },
  { text: 'Pacientes', href: paths.patients, icon: UsersIcon },
  {
    text: 'Fechamento de Caixa',
    href: paths.appointmentsSummary,
    icon: BanknotesIcon,
  },
] as const;

export const patientAppointmentPaths = ({
  patientId,
}: {
  patientId: string;
}) => [
  { text: 'Prontuário', href: paths.patientHandbooks(patientId) },
  { text: 'Receituário', href: paths.patientPrescriptions(patientId) },
  { text: 'Atestados', href: paths.patientDoctorNotes(patientId) },
  { text: 'Exames', href: paths.patientExams(patientId) },
];
export const patientDetailsPaths = ({ patientId }: { patientId: string }) => [
  { text: 'Informações', href: paths.patientsById(patientId) },
  {
    text: 'Minhas Consultas',
    href: paths.specificPatientAppointments(patientId),
  },
  {
    text: 'Todas as Consultas',
    href: paths.allPatientAppointments(patientId),
  },
];

export default paths;
