import Button from '@/components/core/Button';
import MyLink from '@/components/core/MyLink';
import paths from '@/constants/paths';
import { formatCPF } from '@/helpers/formatters';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import type { Patient } from '@prisma/client';
import { format } from 'date-fns';
import type { Dispatch, FC, SetStateAction } from 'react';

type Props = {
  patient: Patient | null | undefined;
  setSelectedPatient: Dispatch<SetStateAction<Patient | undefined>>;
};

const PatientData: FC<Props> = ({ setSelectedPatient, patient }) => (
  <div className="flex flex-auto flex-col justify-between p-6">
    <div className="pb-6 sm:hidden">
      <Button
        size="xs"
        iconLeft={ChevronLeftIcon}
        onClick={() => setSelectedPatient(undefined)}
      >
        Voltar
      </Button>
    </div>
    <dl className="grid grid-cols-2 items-center gap-x-4 gap-y-3 text-sm text-gray-700">
      <dt className="font-semibold text-gray-900">Nome</dt>
      <dd>{patient?.name}</dd>
      {patient?.cpf && (
        <>
          <dt className="font-semibold text-gray-900">CPF</dt>
          <dd>{formatCPF(patient.cpf)}</dd>
        </>
      )}
      {patient?.birthDate && (
        <>
          <dt className="font-semibold text-gray-900">Data de Nascimento</dt>
          <dd>{format(patient?.birthDate, 'dd/MM/yyyy')}</dd>
        </>
      )}
    </dl>
    <div className="flex flex-col items-end justify-between gap-y-2 pt-4 lg:flex-row lg:items-center">
      <MyLink
        href={paths.patientsById(patient?.id ?? '')}
        variant="button-secondary"
      >
        Ver Paciente
      </MyLink>
      <MyLink
        variant="button-primary"
        href={paths.newPatientAppointment(patient?.id ?? '')}
      >
        Colocar na Fila
      </MyLink>
    </div>
  </div>
);

export default PatientData;
