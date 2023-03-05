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
import type { FieldValue } from '@/types/handbook';
import PrintablesLayout from './PrintablesLayout';

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

    return (
      <PrintablesLayout ref={ref} doctor={doctor} printable={printable}>
        <div>
          <Text>Para:</Text>
          <Text b>{patient?.name}</Text>
        </div>
        <div className="mt-3 flex flex-col gap-y-3">
          {toBePrintedFields.map((field) => (
            <div key={field.id}>
              {showHandbookField({
                field: field.type,
                label: field.label,
                value: field.value as FieldValue,
              })}
            </div>
          ))}
        </div>
      </PrintablesLayout>
    );
  }
);

export default HandbookPrintable;
