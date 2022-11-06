/* eslint no-console:off */
import { adminAuth } from '@/services/firebase/admin';
import { NextApiRequestExtended } from '@/types/api';
import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import tryCatch from './tryCatch';

export const isAuthenticated = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  const { authorization } = req.headers;

  const [token, errorUnauthorized] = await tryCatch(
    adminAuth.verifyIdToken(authorization?.split(' ')[1] ?? '')
  );

  if (errorUnauthorized) {
    res
      .status(401)
      .json({ message: 'You are not logged in', error: errorUnauthorized });
    return;
  }

  req.token = token;

  await next();
};

export const requestTimer = async (
  req: NextApiRequestExtended,
  res: NextApiResponse,
  next: NextHandler
) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`${req.url} took ${end - start}ms`);
};

export const validateBody =
  (schema: any) =>
  async (
    req: NextApiRequestExtended,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    const { body } = req;
    const bodyValidation = schema.safeParse(body);

    if (!bodyValidation.success) {
      res.status(400).json({
        message: 'Invalid body',
        error: bodyValidation.error.format(),
      });

      return;
    }

    await next();
  };
