/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import type { Doctor, Printable, Patient, Prescription } from '@prisma/client';
import { forwardRef } from 'react';
import PrintablesLayout from './PrintablesLayout';

type Props = {
  prescriptions: Prescription[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
  printable?: Printable | null | undefined;
};

const PrescriptionPrintable = forwardRef<HTMLDivElement, Props>(
  ({ prescriptions, doctor, patient, printable }, ref) => (
    <PrintablesLayout ref={ref} printable={printable} doctor={doctor}>
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
    </PrintablesLayout>
  )
);

export default PrescriptionPrintable;
