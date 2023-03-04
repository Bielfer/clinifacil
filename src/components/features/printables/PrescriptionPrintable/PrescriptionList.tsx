import type { Patient, Prescription } from '@prisma/client';
import type { FC } from 'react';
import Text from '@/components/core/Text';
import clsx from 'clsx';

type Props = {
  className?: string;
  prescriptions: Prescription[];
  patient?: Patient | null | undefined;
};

const PrescriptionList: FC<Props> = ({ className, prescriptions, patient }) => (
  <div className={clsx('w-full max-w-md px-3', className)}>
    <Text>Para:</Text>
    <Text b>{patient?.name}</Text>
    {prescriptions.map((prescription, idx) => (
      <div key={prescription.id} className="py-3">
        <Text p>
          {idx + 1}. {prescription.medicationName} - {prescription.boxAmount}{' '}
          Caixa(s)
        </Text>
        <Text p>{prescription.instructions}</Text>
      </div>
    ))}
  </div>
);

export default PrescriptionList;
