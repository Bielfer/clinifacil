import { Prescription } from '@prisma/client';
import type { FC } from 'react';
import Text from '@/components/core/Text';

type Props = {
  className?: string;
  prescriptions: Prescription[];
};

const PrescriptionList: FC<Props> = ({ className, prescriptions }) => (
  <div className={className}>
    {prescriptions.map((prescription, idx) => (
      <div key={prescription.id} className="py-3 px-6">
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
