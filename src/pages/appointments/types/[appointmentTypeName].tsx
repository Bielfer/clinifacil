import Dropdown from '@/components/core/Dropdown';
import EmptyState from '@/components/core/EmptyState';
import If from '@/components/core/If';
import Sidebar from '@/components/core/Sidebar';
import Table from '@/components/core/Table';
import TableSkeleton from '@/components/core/Table/TableSkeleton';
import Text from '@/components/core/Text';
import { appointmentStatus } from '@/constants/appointment-status';
import { sidebarPaths } from '@/constants/paths';
import {
  TimeInterval,
  timeIntervalNames,
  timeIntervals,
} from '@/constants/time-intervals';
import { formatCurrency } from '@/helpers/formatters';
import { useActiveDoctor } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { ObjectEntries } from '@/types/core';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

const AppointmentsTypeByName: Page = () => {
  const [interval, setInterval] = useState<TimeInterval>(timeIntervals.today);
  const appointmentTypeName = useRouter().query.appointmentTypeName as string;
  const { data: doctor } = useActiveDoctor();
  const { data: appointments, isLoading } = trpc.appointment.getMany.useQuery(
    {
      doctorId: doctor?.id,
      interval,
      typeName: appointmentTypeName,
      status: [appointmentStatus.finished, appointmentStatus.archived],
    },
    { enabled: !!doctor }
  );

  return (
    <>
      <Head>
        <title>CliniFácil | {appointmentTypeName} Detalhado</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="mb-6 flex items-center justify-between">
          <Text h2>{appointmentTypeName} Detalhado</Text>
          <Dropdown
            data={(
              Object.entries(timeIntervalNames) as ObjectEntries<
                typeof timeIntervalNames
              >
            ).map(([value, name]) => ({
              text: name,
              value,
            }))}
            value={interval}
            setValue={setInterval}
          />
        </div>
        <If>
          <If.Case condition={!!appointments && appointments.length === 0}>
            <EmptyState
              icon={ClipboardDocumentIcon}
              title="Nenhuma consulta nesse período"
              subtitle="Para verificar outros períodos basta clicar no seletor acima"
            />
          </If.Case>
          <If.Case condition={!!appointments && appointments.length > 0}>
            <Table>
              <Table.Head>
                <Table.Header>Nome</Table.Header>
                <Table.Header>Preço</Table.Header>
              </Table.Head>
              <Table.Body>
                {appointments?.map((appointment) => (
                  <Table.Row key={appointment.id}>
                    <Table.Data>{appointment.patient.name}</Table.Data>
                    <Table.Data>
                      {formatCurrency(appointment.type.price ?? 0, {
                        keepZero: false,
                      })}
                    </Table.Data>
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Data className="font-bold">Total</Table.Data>
                  <Table.Data>
                    {formatCurrency(
                      appointments?.reduce(
                        (total, appointment) =>
                          total + (appointment.type?.price ?? 0),
                        0
                      ) ?? 0,
                      { keepZero: false }
                    )}
                  </Table.Data>
                </Table.Row>
              </Table.Body>
            </Table>
          </If.Case>
          <If.Case condition={isLoading}>
            <Table>
              <Table.Head>
                <Table.Header>Tipo de Consulta</Table.Header>
                <Table.Header>Total</Table.Header>
              </Table.Head>
              <Table.Body>
                <TableSkeleton columns={2} rows={3} />
              </Table.Body>
            </Table>
          </If.Case>
        </If>
      </Sidebar>
    </>
  );
};

AppointmentsTypeByName.auth = 'block';
AppointmentsTypeByName.allowHigherOrEqualRole = 'RECEPTIONIST';

export default AppointmentsTypeByName;
