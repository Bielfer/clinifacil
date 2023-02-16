/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import type { Doctor, Patient, Prescription } from '@prisma/client';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';

type Props = {
  prescriptions: Prescription[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
};

const PrescriptionPrintable = forwardRef<HTMLDivElement, Props>(
  ({ prescriptions, doctor, patient }, ref) => {
    const today = new Date();

    return (
      <div
        className="flex h-screen flex-col items-center justify-between px-12 py-16"
        ref={ref}
      >
        <Text b className="mb-6 justify-center">
          Receita
        </Text>
        <div>
          <Text>Para:</Text>
          <Text>{patient?.name}</Text>
          <div className="mt-4">
            {prescriptions.map((prescription, idx) => (
              <div
                key={prescription.id}
                className="border-t border-dashed border-gray-700 py-3 px-6 first:border-0"
              >
                <Text p>
                  {idx + 1}. {prescription.medicationName} -{' '}
                  {prescription.boxAmount} Caixa(s)
                </Text>
                <Text p>{prescription.instructions}</Text>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Text>
            {doctor?.city ?? ''}, {getDate(today)} de{' '}
            {monthNames[getMonth(today)]} de {getYear(today)}
          </Text>
          {doctor && (
            <div className="mt-20 flex flex-col items-center border-t border-gray-900">
              <Text>Dr. {doctor.name}</Text>
              <Text>CRM {doctor.crm}</Text>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default PrescriptionPrintable;
