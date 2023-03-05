/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import type { Doctor, DoctorNote, Printable } from '@prisma/client';
import { forwardRef } from 'react';
import PrintablesLayout from './PrintablesLayout';

type Props = {
  doctorNote: DoctorNote;
  doctor?: Doctor | null | undefined;
  printable?: Printable | null | undefined;
};

const DoctorNotePrintable = forwardRef<HTMLDivElement, Props>(
  ({ doctorNote, doctor, printable }, ref) => (
    <PrintablesLayout ref={ref} printable={printable} doctor={doctor}>
      <div className="text-justify">
        <Text>{doctorNote.message}</Text>
        {doctorNote?.cid && <Text className="pt-3">CID: {doctorNote.cid}</Text>}
      </div>
    </PrintablesLayout>
  )
);

export default DoctorNotePrintable;
