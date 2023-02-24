/* eslint react/display-name:off */
import { toPrintField } from '@/constants/field-types';
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
        className="h-screen justify-between bg-cover bg-center bg-no-repeat bg-origin-border py-40"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="mx-auto w-1/2">
          {printable && (
            <Text h3 className="justify-center">
              {printable.name}
            </Text>
          )}
          <div>
            <Text>Para:</Text>
            <Text>{patient?.name}</Text>
          </div>
          {toBePrintedFields.map((field) => (
            <div key={field.id}>
              {toPrintField({
                field: field.type,
                label: field.label,
                value: field.value,
              })}
            </div>
          ))}
          <div>
            <Text className="justify-center">
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
