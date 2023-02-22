import DescriptionList from '@/components/core/DescriptionList';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import paths, { patientDetailsPaths, sidebarPaths } from '@/constants/paths';
import { useRoles } from '@/hooks';
import useActiveDoctor from '@/hooks/useActiveDoctor';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { ArrowRightCircleIcon, PlusIcon } from '@heroicons/react/20/solid';
import { differenceInYears, format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Url } from 'url';

const PatientsById: Page = () => {
  const router = useRouter();
  const { isDoctor } = useRoles();
  const patientId = router.query.patientId as string;
  const { data: doctor } = useActiveDoctor();
  const { data: patient, isLoading: isLoadingPatient } =
    trpc.patient.getById.useQuery(
      {
        id: parseInt(patientId, 10),
      },
      { enabled: !!patientId }
    );
  const { data: activeAppointment, isLoading: isLoadingAppointment } =
    trpc.appointment.active.useQuery(
      {
        patientId: parseInt(patientId, 10),
        doctorId: doctor?.id ?? 0,
      },
      { enabled: !!doctor && !!patientId }
    );

  const activeAppointmentHandbooks =
    activeAppointment && activeAppointment.handbooks;
  const appointmentHasHandbook =
    activeAppointmentHandbooks && activeAppointmentHandbooks.length > 0;

  let href: string | Partial<Url>;

  if (!activeAppointment)
    href = {
      pathname: paths.newPatientAppointment(patientId),
      query: { onSubmitRedirectUrl: paths.patientHandbooks(patientId) },
    };
  else if (appointmentHasHandbook) href = paths.patientHandbooks(patientId);
  else href = paths.newPatientHandbook(patientId);

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
              href={href}
              variant="button-primary"
              iconLeft={
                appointmentHasHandbook ? ArrowRightCircleIcon : PlusIcon
              }
              isLoading={isLoadingAppointment}
            >
              {appointmentHasHandbook
                ? 'Continuar Atendimento'
                : 'Nova Consulta'}
            </MyLink>
          )}
        </div>
        <TabsNavigation tabs={patientDetailsPaths({ patientId })} />
        <DescriptionList
          className="pt-14"
          title="Informações Gerais"
          loading={isLoadingPatient}
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
