/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import type { Doctor, Patient, Prescription } from '@prisma/client';
import clsx from 'clsx';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';
import PrescriptionList from './PrescriptionList';

type Props = {
  prescriptions: Prescription[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
};

const PrescriptionPrintable = forwardRef<HTMLDivElement, Props>(
  ({ prescriptions, doctor, patient }, ref) => {
    const today = new Date();
    const doctorPrescriptionBackground = false;

    return (
      <div
        className={clsx(
          'flex h-screen flex-col items-center px-12 py-16',
          doctorPrescriptionBackground
            ? `justify-center bg-[url('/stefane/receituario.png')] bg-cover bg-center bg-no-repeat bg-origin-border`
            : 'justify-between'
        )}
        ref={ref}
      >
        {doctorPrescriptionBackground ? (
          <PrescriptionList prescriptions={prescriptions} />
        ) : (
          <>
            <Text b className="mb-6 justify-center">
              Receita
            </Text>
            <div>
              <Text>Para:</Text>
              <Text className="mb-4">{patient?.name}</Text>
              <PrescriptionList prescriptions={prescriptions} />
            </div>
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
          </>
        )}
      </div>
    );
  }
);

export default PrescriptionPrintable;
