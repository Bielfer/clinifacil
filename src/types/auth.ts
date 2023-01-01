import type { NextPage } from 'next';

export type Page<P = {}, IP = P> = NextPage<P, IP> & {
  auth?: AuthType;
  loggedInRedirect?: string;
};

export type AuthType = 'block' | 'allow' | 'wait';
