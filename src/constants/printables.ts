import type { PrintableType } from '@prisma/client';

export const printableTypes = {
  doctorNote: 'DOCTOR_NOTE',
  exams: 'EXAMS',
  prescription: 'PRESCRIPTION',
  glassesPrescription: 'GLASSES_PRESCRIPTION',
} as const;

export const printableTypesValues = Object.values(
  printableTypes
) as unknown as readonly [PrintableType, ...PrintableType[]];
