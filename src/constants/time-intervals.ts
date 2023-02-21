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
import { zonedTimeToUtc } from 'date-fns-tz';

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
    gte: zonedTimeToUtc(startOfToday(), 'Etc/UTC'),
    lte: zonedTimeToUtc(endOfToday(), 'Etc/UTC'),
  },
  YESTERDAY: {
    gte: zonedTimeToUtc(startOfYesterday(), 'Etc/UTC'),
    lte: zonedTimeToUtc(endOfYesterday(), 'Etc/UTC'),
  },
  THIS_WEEK: {
    gte: zonedTimeToUtc(startOfWeek(new Date()), 'Etc/UTC'),
    lte: zonedTimeToUtc(endOfWeek(new Date()), 'Etc/UTC'),
  },
  THIS_MONTH: {
    gte: zonedTimeToUtc(startOfMonth(new Date()), 'Etc/UTC'),
    lte: zonedTimeToUtc(endOfMonth(new Date()), 'Etc/UTC'),
  },
} as const;

export const timeIntervalNames = {
  TODAY: 'Hoje',
  YESTERDAY: 'Ontem',
  THIS_WEEK: 'Essa Semana',
  THIS_MONTH: 'Esse Mês',
} as const;
