import { trpc } from '@/services/trpc';
import { ChangeTypeOfKeys } from '@/types/core';
import type { Patient } from '@prisma/client';
import { format } from 'date-fns';
import { useFormikContext } from 'formik';
import { FC, useEffect } from 'react';

const SearchPatientByCpf: FC = () => {
  const { values, setValues } =
    useFormikContext<
      Partial<ChangeTypeOfKeys<Patient, 'birthDate', string | undefined>>
    >();
  const { cpf } = values;
  const { data: patient } = trpc.patient.get.useQuery(
    {
      cpf: cpf ?? undefined,
    },
    { enabled: !!cpf && cpf.length === 11 }
  );

  useEffect(() => {
    if (!!cpf && cpf.length !== 11) return;
    if (!patient) return;

    const { id, updatedAt, createdAt, birthDate, ...filteredPatient } = patient;

    setValues({
      ...filteredPatient,
      birthDate: birthDate ? format(birthDate, 'ddMMyyyy') : '',
    });
  }, [cpf, patient, setValues]);

  return null;
};

export default SearchPatientByCpf;
