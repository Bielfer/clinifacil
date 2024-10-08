import Sidebar from '@/components/core/Sidebar';
import { Page } from '@/types/auth';
import Head from 'next/head';
import Text from '@/components/core/Text';
import Table from '@/components/core/Table';
import { trpc } from '@/services/trpc';
import { appointmentStatus } from '@/constants/appointment-status';
import { differenceInYears, format } from 'date-fns';
import MyLink from '@/components/core/MyLink';
import paths, { sidebarPaths } from '@/constants/paths';
import {
  CursorArrowRaysIcon,
  PlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import RoleController from '@/components/core/RoleController';
import { roles } from '@/constants/roles';
import SelectDoctor from '@/components/features/receptionist/SelectDoctor';
import { useState } from 'react';
import Tabs from '@/components/core/Tabs';
import type { AppointmentStatus } from '@prisma/client';
import EmptyState from '@/components/core/EmptyState';
import { useActiveDoctor, useRoles } from '@/hooks';
import If from '@/components/core/If';
import useReceptionistStore from '@/store/receptionist';

const Queue: Page = () => {
  const [tabsStatus, setTabsStatus] = useState<AppointmentStatus>(
    appointmentStatus.open
  );
  const isOpenStatus = tabsStatus === appointmentStatus.open;
  const { isReceptionist, isAdminOrHigher } = useRoles();
  const { data: doctor } = useActiveDoctor();
  const { data: appointments, isLoading } = trpc.appointment.getMany.useQuery(
    {
      doctorId: doctor?.id,
      status: tabsStatus,
      orderBy: isOpenStatus ? { displayOrder: 'asc' } : { createdAt: 'asc' },
    },
    { enabled: !!doctor }
  );
  const { mutate: updateAppointment } = trpc.appointment.update.useMutation();
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );

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
        <If>
          <If.Case condition={!!appointments && appointments.length === 0}>
            <EmptyState
              icon={UsersIcon}
              title={
                isOpenStatus
                  ? 'Nenhum paciente adicionado à fila'
                  : 'Nenhum paciente atendido'
              }
              subtitle={
                isOpenStatus
                  ? 'Para adicionar um paciente à fila basta clicar no botão Nova Consulta'
                  : 'Quando um paciente for atendido ele irá aparecer aqui'
              }
            />
          </If.Case>
          <If.Case
            condition={(isReceptionist || isAdminOrHigher) && !selectedDoctorId}
          >
            <EmptyState
              icon={CursorArrowRaysIcon}
              title="Nenhum médico selecionado"
              subtitle="Para selecionar um médico basta clicar no seletor acima"
            />
          </If.Case>
          <If.Case condition={!!appointments && appointments.length > 0}>
            <Table>
              <Table.Head>
                <Table.Header>Chegada</Table.Header>
                <Table.Header>Nome</Table.Header>
                <Table.Header>Idade</Table.Header>
                <Table.Header> </Table.Header>
              </Table.Head>
              <Table.Body>
                {appointments?.map((appointment) => (
                  <Table.Row key={appointment.id}>
                    <Table.Data>
                      {format(appointment.createdAt, 'H:mm')}
                    </Table.Data>
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
                ))}
              </Table.Body>
            </Table>
          </If.Case>
          <If.Case condition={isLoading}>
            <Table>
              <Table.Head>
                <Table.Header>Nome</Table.Header>
                <Table.Header>Idade</Table.Header>
                <Table.Header> </Table.Header>
              </Table.Head>
              <Table.Body>
                <Table.Skeleton rows={5} columns={3} />
              </Table.Body>
            </Table>
          </If.Case>
        </If>
      </Sidebar>
    </>
  );
};

Queue.auth = 'block';
Queue.allowHigherOrEqualRole = 'RECEPTIONIST';

export default Queue;
