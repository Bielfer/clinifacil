import Dropdown from '@/components/core/Dropdown';
import EmptyState from '@/components/core/EmptyState';
import If from '@/components/core/If';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import Table from '@/components/core/Table';
import TableSkeleton from '@/components/core/Table/TableSkeleton';
import Text from '@/components/core/Text';
import paths, { sidebarPaths } from '@/constants/paths';
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
import { useState } from 'react';

const AppointmentsSummary: Page = () => {
  const [interval, setInterval] = useState<TimeInterval>(timeIntervals.today);
  const { data: doctor } = useActiveDoctor();
  const { data: summary, isLoading } = trpc.appointment.summary.useQuery(
    { doctorId: doctor?.id ?? 0, interval },
    {
      enabled: !!doctor,
    }
  );
  const appointmentTypes = summary?.appointmentTypes;

  return (
    <>
      <Head>
        <title>CliniFácil | Resumo do Fechamento de Caixa</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="mb-6 flex items-center justify-between">
          <Text h2>Resumo do Fechamento de Caixa</Text>
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
          <If.Case
            condition={!!appointmentTypes && appointmentTypes.length === 0}
          >
            <EmptyState
              icon={ClipboardDocumentIcon}
              title="Nenhuma consulta nesse período"
              subtitle="Para verificar outros períodos basta clicar no seletor acima"
            />
          </If.Case>
          <If.Case
            condition={!!appointmentTypes && appointmentTypes.length > 0}
          >
            <Table>
              <Table.Head>
                <Table.Header>Tipo de Consulta</Table.Header>
                <Table.Header>Valor</Table.Header>
                <Table.Header> </Table.Header>
              </Table.Head>
              <Table.Body>
                {appointmentTypes?.map((appointmentType) => (
                  <Table.Row key={appointmentType.name}>
                    <Table.Data>{appointmentType.name}</Table.Data>
                    <Table.Data>
                      {formatCurrency(appointmentType._sum.price ?? 0, {
                        keepZero: false,
                      })}
                    </Table.Data>
                    <Table.Data className="flex items-center justify-end">
                      <MyLink
                        href={paths.appointmentTypesByName(
                          appointmentType.name
                        )}
                        variant="primary"
                      >
                        Ver Detalhado
                      </MyLink>
                    </Table.Data>
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Data className="font-bold">Total</Table.Data>
                  <Table.Data>
                    {formatCurrency(summary?.total ?? 0, { keepZero: false })}
                  </Table.Data>
                  <Table.Data className="font-bold"> </Table.Data>
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

AppointmentsSummary.auth = 'block';
AppointmentsSummary.allowHigherOrEqualRole = 'RECEPTIONIST';

export default AppointmentsSummary;
