import Sidebar from '@/components/core/Sidebar';
import { Page } from '@/types/auth';
import Head from 'next/head';
import Text from '@/components/core/Text';
import Table from '@/components/core/Table';
import { trpc } from '@/services/trpc';
import {
  AppointmentStatus,
  appointmentStatus,
} from '@/constants/appointment-status';
import { differenceInYears } from 'date-fns';
import MyLink from '@/components/core/MyLink';
import paths, { sidebarPaths } from '@/constants/paths';
import { PlusIcon } from '@heroicons/react/24/outline';
import RoleController from '@/components/core/RoleController';
import { roles } from '@/constants/roles';
import ChooseDoctor from '@/components/features/receptionist/ChooseDoctor';
import { useSession } from 'next-auth/react';
import useReceptionistStore from '@/store/receptionist';
import { useState } from 'react';
import Tabs from '@/components/core/Tabs';

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

  return (
    <>
      <Head>
        <title>CliniFácil | Fila de Pacientes</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between pb-2">
          <Text h2>Fila de Pacientes</Text>
          <div className="flex items-center gap-5">
            <RoleController role={roles.receptionist}>
              <ChooseDoctor />
            </RoleController>
            <MyLink
              href={paths.newPatient}
              variant="button-primary"
              iconLeft={PlusIcon}
            >
              Nova Consulta
            </MyLink>
          </div>
        </div>
        <Tabs
          className="pb-4"
          tabs={[
            { text: 'Aguardando', value: appointmentStatus.open },
            { text: 'Atendidos', value: appointmentStatus.finished },
          ]}
          value={tabsStatus}
          setValue={setTabsStatus}
        />
        {isReceptionist && !selectedDoctorId ? (
          <div className="flex items-center justify-center">
            <Text h4>Selecione um médico para ver a fila</Text>
          </div>
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
                            appointment.patient.birthDate,
                            new Date()
                          )
                        : 'Idade não informada'}
                    </Table.Data>
                    <Table.Data className="flex items-center justify-end">
                      <RoleController role={roles.doctor}>
                        <MyLink
                          href={paths.patientsById(
                            appointment.patient.id.toString()
                          )}
                          variant="button-secondary"
                        >
                          Consultar Paciente
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

export default Queue;
