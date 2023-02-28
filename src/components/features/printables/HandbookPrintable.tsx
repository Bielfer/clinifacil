/* eslint react/display-name:off */
import { showHandbookField } from '@/constants/handbook-fields';
import type {
  Doctor,
  Handbook,
  HandbookField,
  Patient,
  Printable,
} from '@prisma/client';
import { forwardRef } from 'react';
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import { getDate, getMonth, getYear } from 'date-fns';
import type { FieldValue } from '@/types/handbook';

type Props = {
  handbook: Handbook & {
    fields: HandbookField[];
  };
  doctor?: Doctor | null;
  patient?: Patient | null;
  printable?: Printable | null;
};

const HandbookPrintable = forwardRef<HTMLDivElement, Props>(
  ({ handbook, doctor, patient, printable }, ref) => {
    const toBePrintedFields = handbook.fields.filter((field) => field.print);
    const today = new Date();
    const background = printable?.backgroundUrl;

    return (
      <div
        ref={ref}
        className="absolute top-0 left-0 flex h-full w-full items-center justify-center overflow-hidden bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="flex w-1/2 flex-col justify-between">
          {printable && (
            <Text h3 className="justify-center">
              {printable.name}
            </Text>
          )}
          <div>
            <Text>Para:</Text>
            <Text className="font-semibold">{patient?.name}</Text>
          </div>
          {toBePrintedFields.map((field) => (
            <div key={field.id}>
              {showHandbookField({
                field: field.type,
                label: field.label,
                value: field.value as FieldValue,
              })}
            </div>
          ))}
          <div>
            <Text className="mt-5 justify-center">
              {doctor?.city}, {getDate(today)} de {monthNames[getMonth(today)]}{' '}
              de {getYear(today)}
            </Text>
            {doctor && (
              <div className="mt-20 flex flex-col items-center border-t border-gray-900">
                <Text>Dr. {doctor.name}</Text>
                <Text>CRM {doctor.crm}</Text>
              </div>
            )}
          </div>
        </div>{' '}
      </div>
    );
  }
);

export default HandbookPrintable;
