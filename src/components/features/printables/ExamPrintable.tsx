/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import {
  translateXArray,
  translateXArrayNegative,
  translateYArray,
  translateYArrayNegative,
} from '@/constants/styles';
import type { Doctor, Printable, Patient, Exam } from '@prisma/client';
import clsx from 'clsx';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';

type Props = {
  exams: Exam[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
  printable?: Printable | null | undefined;
};

const ExamPrintable = forwardRef<HTMLDivElement, Props>(
  ({ exams, doctor, patient, printable }, ref) => {
    const today = new Date();
    const background = printable?.backgroundUrl;
    const translateX = (printable && printable.translateX) ?? 0;
    const translateY = (printable && printable.translateY) ?? 0;
    const translateXStyle =
      translateX >= 0
        ? translateXArray[translateX]
        : translateXArrayNegative[-translateX];
    const translateYStyle =
      translateY >= 0
        ? translateYArray[translateY]
        : translateYArrayNegative[-translateY];

    return (
      <div
        className="absolute top-0 left-0 flex h-full w-full items-center justify-center overflow-hidden bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
        ref={ref}
      >
        {background ? (
          <div
            className={clsx(
              'absolute top-1/2 left-1/2 flex h-screen w-full flex-col gap-y-2',
              translateXStyle,
              translateYStyle
            )}
          >
            <Text>Para:</Text>
            <Text b>{patient?.name}</Text>
            <Text className="mt-2">Solicito:</Text>
            <ul className="flex list-inside list-disc flex-col gap-y-3">
              {exams.map((exam) => (
                <li key={exam.id}>{exam.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between py-40">
            <Text b className="mb-6 justify-center">
              Solicitação de Exames
            </Text>
            <div>
              <Text>Para:</Text>
              <Text b className="mb-6">
                {patient?.name}
              </Text>
              <ul className="flex list-inside list-disc flex-col gap-y-3">
                {exams.map((exam) => (
                  <li key={exam.id}>{exam.name}</li>
                ))}
              </ul>
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
          </div>
        )}
      </div>
    );
  }
);

export default ExamPrintable;
