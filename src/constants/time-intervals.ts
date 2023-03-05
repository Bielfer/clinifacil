import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYesterday,
} from 'date-fns';

export const timeIntervals = {
  today: 'TODAY',
  yesterday: 'YESTERDAY',
  thisWeek: 'THIS_WEEK',
  thisMonth: 'THIS_MONTH',
} as const;

export type TimeInterval = typeof timeIntervals[keyof typeof timeIntervals];

export const timeIntervalValues = Object.values(
  timeIntervals
) as unknown as readonly [TimeInterval, ...TimeInterval[]];

export const timeIntervalDates = {
  TODAY: {
    gte: startOfToday(),
    lte: endOfToday(),
  },
  YESTERDAY: {
    gte: startOfYesterday(),
    lte: endOfYesterday(),
  },
  THIS_WEEK: {
    gte: startOfWeek(new Date()),
    lte: endOfWeek(new Date()),
  },
  THIS_MONTH: {
    gte: startOfMonth(new Date()),
    lte: endOfMonth(new Date()),
  },
} as const;

export const timeIntervalNames = {
  TODAY: 'Hoje',
  YESTERDAY: 'Ontem',
  THIS_WEEK: 'Essa Semana',
  THIS_MONTH: 'Esse Mês',
} as const;
