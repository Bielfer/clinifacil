/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import type { Doctor, Printable, Patient, Exam } from '@prisma/client';
import { forwardRef } from 'react';
import PrintablesLayout from './PrintablesLayout';

type Props = {
  exams: Exam[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
  printable?: Printable | null | undefined;
};

const ExamPrintable = forwardRef<HTMLDivElement, Props>(
  ({ exams, doctor, patient, printable }, ref) => (
    <PrintablesLayout ref={ref} doctor={doctor} printable={printable}>
      <Text>Para:</Text>
      <Text b>{patient?.name}</Text>
      <Text className="mt-2">Solicito:</Text>
      <ul className="flex list-inside list-disc flex-col gap-y-1">
        {exams.map((exam) => (
          <li key={exam.id}>{exam.name}</li>
        ))}
      </ul>
    </PrintablesLayout>
  )
);

export default ExamPrintable;
