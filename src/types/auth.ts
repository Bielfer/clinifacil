import { NextComponentType, NextPageContext } from 'next';

export type Page = NextComponentType<NextPageContext> & {
  auth?: AuthType;
};

export type AuthType = 'block' | 'allow' | 'wait';
