import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import type { NextApiRequest } from 'next';
import { Role } from './role';

interface DecodedIdTokenWithRoles extends DecodedIdToken {
  roles?: Array<Role>;
}

export interface NextApiRequestExtended extends NextApiRequest {
  token: DecodedIdTokenWithRoles | null;
}

export interface ResponseFormat<T> {
  message: string;
  data: T;
}
