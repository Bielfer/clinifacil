import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import type { NextApiRequest } from 'next';

export interface NextApiRequestExtended extends NextApiRequest {
  token: DecodedIdToken | null;
}

export interface ResponseFormat<T> {
  message: string;
  data: T;
}
