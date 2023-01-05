import type { NextPage } from 'next';
import { Role } from './role';

export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  auth?: AuthType;
  allowHigherOrEqualRole?: Role;
  loggedInRedirect?: string;
};

export type AuthType = 'block' | 'allow' | 'wait';
