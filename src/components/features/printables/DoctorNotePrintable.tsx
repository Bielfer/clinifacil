/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import type { Doctor, DoctorNote } from '@prisma/client';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';

type Props = {
  doctorNote: DoctorNote;
  doctor?: Doctor | null | undefined;
};

const DoctorNotePrintable = forwardRef<HTMLDivElement, Props>(
  ({ doctorNote, doctor }, ref) => {
    const today = new Date();

    return (
      <div
        className="flex h-screen flex-col items-center justify-between px-12 py-16"
        ref={ref}
      >
        <Text b className="mb-6 justify-center">
          Atestado Médico
        </Text>
        <Text className="text-justify">{doctorNote.message}</Text>
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

export default DoctorNotePrintable;
