/* eslint no-console:off */
import { roles } from '@/constants/roles';
import { adminAuth } from '@/services/firebase/admin';
import { NextApiRequestExtended } from '@/types/api';
import { Role } from '@/types/role';
import { NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import {
  isHigherInRoleHierarchy,
  isHigherOrEqualInRoleHierarchy,
} from './roles';
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

export const authorizeHigherOrEqualRole =
  (role: Role) =>
  async (
    req: NextApiRequestExtended,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    const { token } = req;
    const roleValues = Object.values(roles);
    const highestRole =
      roleValues.filter((roleValue) =>
        token?.roles?.includes(roleValue)
      )?.[0] ?? roleValues[roleValues.length - 1];

    if (!isHigherInRoleHierarchy(highestRole, role)) {
      res.status(400).json({
        message: "You don't have permission to access this content!",
        error: 'Invalid role',
      });

      return;
    }

    await next();
  };

export const isDocumentOwner =
  (queryKey: string, allowedRole?: Role) =>
  async (
    req: NextApiRequestExtended,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    const { token, query } = req;
    const idToCompare = query?.[queryKey];
    const roleValues = Object.values(roles);
    const highestRole =
      roleValues.filter((roleValue) =>
        token?.roles?.includes(roleValue)
      )?.[0] ?? roleValues[roleValues.length - 1];

    if (
      idToCompare !== token?.uid &&
      !isHigherOrEqualInRoleHierarchy(highestRole, allowedRole ?? roles.master)
    ) {
      res.status(403).json({ message: "You don't have permission!" });
      return;
    }

    await next();
  };
