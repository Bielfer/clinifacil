import DescriptionList from '@/components/core/DescriptionList';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import { appointmentStatus } from '@/constants/appointment-status';
import paths, { sidebarPaths } from '@/constants/paths';
import { useRoles } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { ArrowRightCircleIcon, PlusIcon } from '@heroicons/react/20/solid';
import { differenceInYears, format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientsById: Page = () => {
  const router = useRouter();
  const { isDoctor } = useRoles();
  const patientId = router.query.patientId as string;
  const { data: patient, isLoading } = trpc.patient.getById.useQuery(
    {
      id: parseInt(patientId, 10),
    },
    { enabled: !!patientId }
  );
  const { data: appointments } = trpc.appointment.getMany.useQuery(
    {
      patientId: parseInt(patientId, 10),
      status: [appointmentStatus.open, appointmentStatus.finished],
    },
    { enabled: !!patientId }
  );

  const activeAppointmentHandbooks = appointments?.[0].handbooks;
  const appointmentHasHandbook =
    activeAppointmentHandbooks && activeAppointmentHandbooks.length > 0;

  return (
    <>
      <Head>
        <title>CliniFácil | Detalhes do Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between pb-2">
          <Text h2>Detalhes do Paciente</Text>
          {isDoctor && (
            <MyLink
              href={
                appointmentHasHandbook
                  ? paths.patientHandbooks(patientId)
                  : paths.newPatientHandbook(patientId)
              }
              variant="button-primary"
              iconLeft={
                appointmentHasHandbook ? ArrowRightCircleIcon : PlusIcon
              }
            >
              {appointmentHasHandbook
                ? 'Continuar Atendimento'
                : 'Nova Consulta'}
            </MyLink>
          )}
        </div>
        <TabsNavigation
          tabs={[
            { text: 'Informações', href: paths.patientsById(patientId) },
            {
              text: 'Minhas Consultas',
              href: paths.specificPatientAppointments(patientId),
            },
            {
              text: 'Todas as Consultas',
              href: paths.allPatientAppointments(patientId),
            },
          ]}
        />
        <DescriptionList
          className="pt-14"
          title="Informações Gerais"
          loading={isLoading}
          linkOrButton={
            <MyLink
              href={paths.editPatient(patientId)}
              variant="button-secondary"
            >
              Editar
            </MyLink>
          }
          items={[
            { label: 'Nome', value: patient?.name },
            { label: 'Sexo', value: patient?.sex as string },
            {
              label: 'Data de Nascimento',
              value:
                patient?.birthDate && format(patient.birthDate, 'dd/MM/yyyy'),
            },
            {
              label: 'Idade',
              value:
                patient?.birthDate &&
                differenceInYears(new Date(), patient.birthDate),
            },
          ]}
        />
      </Sidebar>
    </>
  );
};

PatientsById.auth = 'block';
PatientsById.allowHigherOrEqualRole = 'RECEPTIONIST';

export default PatientsById;
