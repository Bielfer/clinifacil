import type { ExamType } from '@prisma/client';

export const examTypes = {
  regular: 'REGULAR',
  image: 'IMAGE',
} as const;

export const examTypeValues = Object.values(examTypes) as unknown as readonly [
  ExamType,
  ...ExamType[]
];
