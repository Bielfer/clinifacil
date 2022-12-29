import { NextComponentType, NextPageContext } from 'next';
import { Session, User as NextAuthUser } from 'next-auth';
import { Role } from './role';

export type Page = NextComponentType<NextPageContext> & {
  auth?: AuthType;
  loggedInRedirect?: string;
};

export type AuthType = 'block' | 'allow' | 'wait';

export type ExtendedSession = Session & { id?: string; role?: Role };

export type ExtendedUser = NextAuthUser & { role?: Role };
