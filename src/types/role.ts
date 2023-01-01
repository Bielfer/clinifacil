import { roles } from '@/constants/roles';

export type Role = typeof roles[keyof typeof roles];
