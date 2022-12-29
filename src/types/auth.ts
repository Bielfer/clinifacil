import { NextComponentType, NextPageContext } from 'next';

export type Page = NextComponentType<NextPageContext> & {
  auth?: AuthType;
  loggedInRedirect?: string;
};

export type AuthType = 'block' | 'allow' | 'wait';
