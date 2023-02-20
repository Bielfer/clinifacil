import { Prescription } from '@prisma/client';
import type { FC } from 'react';
import Text from '@/components/core/Text';

type Props = {
  prescriptions: Prescription[];
};

const PrescriptionList: FC<Props> = ({ prescriptions }) => (
  <div>
    {prescriptions.map((prescription, idx) => (
      <div
        key={prescription.id}
        className="border-t border-dashed border-gray-700 py-3 px-6 first:border-0"
      >
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
