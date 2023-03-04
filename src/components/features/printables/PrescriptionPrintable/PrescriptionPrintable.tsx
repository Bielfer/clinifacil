/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import type { Doctor, Printable, Patient, Prescription } from '@prisma/client';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';
import PrintablesLayout from '../PrintablesLayout';
import PrescriptionList from './PrescriptionList';

type Props = {
  prescriptions: Prescription[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
  printable?: Printable | null | undefined;
};

const PrescriptionPrintable = forwardRef<HTMLDivElement, Props>(
  ({ prescriptions, doctor, patient, printable }, ref) => {
    const today = new Date();

    return (
      <PrintablesLayout ref={ref} printable={printable}>
        <div className="flex flex-col items-center">
          {printable?.displayName && (
            <Text b className="justify-center">
              {printable.name}
            </Text>
          )}
          <PrescriptionList
            className="my-16"
            prescriptions={prescriptions}
            patient={patient}
          />
          {printable?.footer && (
            <div>
              <Text>
                {doctor?.city}, {getDate(today)} de{' '}
                {monthNames[getMonth(today)]} de {getYear(today)}
              </Text>
              {doctor && (
                <div className="mt-20 flex flex-col items-center border-t border-gray-900">
                  <Text>Dr. {doctor.name}</Text>
                  <Text>CRM {doctor.crm}</Text>
                </div>
              )}
            </div>
          )}
        </div>
      </PrintablesLayout>
    );
  }
);

export default PrescriptionPrintable;
