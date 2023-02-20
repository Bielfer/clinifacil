/* eslint react/display-name:off */
import Text from '@/components/core/Text';
import { monthNames } from '@/constants/dates';
import {
  translateXArray,
  translateXArrayNegative,
  translateYArray,
  translateYArrayNegative,
} from '@/constants/styles';
import type {
  Doctor,
  DoctorPrescription,
  Patient,
  Prescription,
} from '@prisma/client';
import clsx from 'clsx';
import { getDate, getMonth, getYear } from 'date-fns';
import { forwardRef } from 'react';
import PrescriptionList from './PrescriptionList';

type Props = {
  prescriptions: Prescription[];
  doctor?: Doctor | null | undefined;
  patient?: Patient | null | undefined;
  doctorPrescription?: DoctorPrescription | null | undefined;
};

const PrescriptionPrintable = forwardRef<HTMLDivElement, Props>(
  ({ prescriptions, doctor, patient, doctorPrescription }, ref) => {
    const today = new Date();
    const doctorPrescriptionBackground = doctorPrescription?.backgroundUrl;
    const translateX =
      (doctorPrescription && doctorPrescription.translateX) ?? 0;
    const translateY =
      (doctorPrescription && doctorPrescription.translateY) ?? 0;
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
        className={clsx(
          'h-screen px-12 py-16',
          doctorPrescriptionBackground
            ? 'bg-cover bg-center bg-no-repeat bg-origin-border'
            : 'flex flex-col items-center justify-between'
        )}
        style={{ backgroundImage: `url(${doctorPrescriptionBackground})` }}
        ref={ref}
      >
        {doctorPrescriptionBackground ? (
          <PrescriptionList
            className={clsx(
              'absolute top-1/2 left-1/2 h-screen w-screen',
              translateXStyle,
              translateYStyle
            )}
            prescriptions={prescriptions}
          />
        ) : (
          <>
            <Text b className="mb-6 justify-center">
              Receita
            </Text>
            <div>
              <Text>Para:</Text>
              <Text>{patient?.name}</Text>
              <PrescriptionList
                className="mt-4"
                prescriptions={prescriptions}
              />
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
