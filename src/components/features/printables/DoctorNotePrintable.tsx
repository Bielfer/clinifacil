/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import type { Doctor, DoctorNote, Printable } from '@prisma/client';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';

type Props = {
  doctorNote: DoctorNote;
  doctor?: Doctor | null | undefined;
  printable?: Printable | null | undefined;
};

const DoctorNotePrintable = forwardRef<HTMLDivElement, Props>(
  ({ doctorNote, doctor, printable }, ref) => {
    const today = new Date();

    const background = printable && printable.backgroundUrl;

    return (
      <div
        className="absolute top-0 left-0 flex h-full w-full items-center justify-center overflow-hidden bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
        ref={ref}
      >
        {background ? (
          <div className="w-5/6 text-justify">
            <Text>{doctorNote.message}</Text>
            {doctorNote?.cid && (
              <Text className="pt-3">CID: {doctorNote.cid}</Text>
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-between py-40">
            <Text b className="mb-6 justify-center">
              Atestado Médico
            </Text>
            <div className="w-5/6 text-justify">
              <Text>{doctorNote.message}</Text>
              {doctorNote?.cid && (
                <Text className="pt-3">CID: {doctorNote.cid}</Text>
              )}
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
        )}
      </div>
    );
  }
);

export default DoctorNotePrintable;
