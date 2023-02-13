import Sidebar from '@/components/core/Sidebar';
import { Page } from '@/types/auth';
import Head from 'next/head';
import Text from '@/components/core/Text';
import Table from '@/components/core/Table';
import { trpc } from '@/services/trpc';
import { appointmentStatus } from '@/constants/appointment-status';
import { differenceInYears } from 'date-fns';
import MyLink from '@/components/core/MyLink';
import paths, { sidebarPaths } from '@/constants/paths';
import { CursorArrowRaysIcon, PlusIcon } from '@heroicons/react/24/outline';
import RoleController from '@/components/core/RoleController';
import { roles } from '@/constants/roles';
import SelectDoctor from '@/components/features/receptionist/SelectDoctor';
import { useSession } from 'next-auth/react';
import useReceptionistStore from '@/store/receptionist';
import { useState } from 'react';
import Tabs from '@/components/core/Tabs';
import type { AppointmentStatus } from '@prisma/client';
import EmptyState from '@/components/core/EmptyState';

const Queue: Page = () => {
  const [tabsStatus, setTabsStatus] = useState<AppointmentStatus>(
    appointmentStatus.open
  );
  const { data: session } = useSession();
  const userRole = session?.user.role;
  const isDoctor = userRole === roles.doctor;
  const isReceptionist = userRole === roles.receptionist;
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );
  const { data: doctor } = trpc.doctor.get.useQuery(
    { userId: session?.user.id },
    { enabled: isDoctor }
  );
  const queryAppointments = isDoctor ? !!doctor?.id : !!selectedDoctorId;
  const { data: appointments, isLoading } = trpc.appointment.getMany.useQuery(
    {
      doctorId: isDoctor ? doctor?.id : selectedDoctorId,
      status: tabsStatus,
    },
    { enabled: queryAppointments }
  );
  const { mutate: updateAppointment } = trpc.appointment.update.useMutation();

  const isOpenStatus = tabsStatus === appointmentStatus.open;

  return (
    <>
      <Head>
        <title>CliniFácil | Fila de Pacientes</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex justify-between pb-2 sm:items-center">
          <Text h2>Fila de Pacientes</Text>
          <div className="flex flex-col-reverse items-end gap-2 sm:flex-row sm:items-center sm:gap-5">
            <RoleController role={roles.receptionist}>
              <SelectDoctor />
            </RoleController>
            <MyLink
              href={paths.patients}
              variant="button-primary"
              iconLeft={PlusIcon}
            >
              Nova Consulta
            </MyLink>
          </div>
        </div>
        <Tabs
          className="pb-6"
          tabs={[
            { text: 'Aguardando', value: appointmentStatus.open },
            { text: 'Atendidos', value: appointmentStatus.finished },
          ]}
          value={tabsStatus}
          setValue={setTabsStatus}
        />
        {isReceptionist && !selectedDoctorId ? (
          <EmptyState
            icon={CursorArrowRaysIcon}
            title="Nenhum médico selecionado"
            subtitle="Para selecionar um médico basta clicar no seletor acima"
          />
        ) : (
          <Table>
            <Table.Head>
              <Table.Header>Nome</Table.Header>
              <Table.Header>Idade</Table.Header>
              <Table.Header> </Table.Header>
            </Table.Head>
            <Table.Body>
              {isLoading ? (
                <Table.Skeleton rows={5} columns={3} />
              ) : (
                appointments?.map((appointment) => (
                  <Table.Row key={appointment.id}>
                    <Table.Data>{appointment.patient.name}</Table.Data>
                    <Table.Data>
                      {appointment.patient.birthDate
                        ? differenceInYears(
                            new Date(),
                            appointment.patient.birthDate
                          )
                        : 'Idade não informada'}
                    </Table.Data>
                    <Table.Data className="flex items-center justify-end">
                      <RoleController role={roles.doctor}>
                        <MyLink
                          href={paths.patientsById(appointment.patient.id)}
                          variant="primary"
                          onClick={() => {
                            if (!isOpenStatus) return;

                            updateAppointment({
                              id: appointment.id,
                              status: appointmentStatus.finished,
                            });
                          }}
                        >
                          {isOpenStatus ? 'Consultar Paciente' : 'Ver Consulta'}
                        </MyLink>
                      </RoleController>
                    </Table.Data>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        )}
      </Sidebar>
    </>
  );
};

Queue.auth = 'block';
Queue.allowHigherOrEqualRole = 'RECEPTIONIST';

export default Queue;
