/* eslint no-console:off */
import { roles } from '@/constants/roles';
import {
  authorizeHigherOrEqualRole,
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { adminAuth } from '@/services/firebase/admin';
import { NextApiRequestExtended } from '@/types/api';
import { roleSchema } from '@/types/role';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(validateBody(roleSchema))
  .use(isAuthenticated)
  .use(authorizeHigherOrEqualRole(roles.admin))
  .put(async (req, res) => {
    const { token } = req;
    const { uid, role } = req.body;
    let newRoles: string[] = [role];

    const userRoles = token?.roles ?? [];

    if (Array.isArray(userRoles)) newRoles = [...newRoles, ...userRoles];

    const [, error] = await tryCatch(
      adminAuth.setCustomUserClaims(uid, { roles: newRoles })
    );

    if (error)
      res.status(400).json({ message: 'Failed to remove role', error });

    const [data, errorUser] = await tryCatch(adminAuth.getUser(uid));

    if (errorUser)
      res.status(400).json({ message: 'Failed to get user', error });

    res.status(200).json({ message: 'Role removed successfully!', data });
  });

router
  .use(validateBody(roleSchema))
  .use(isAuthenticated)
  .use(authorizeHigherOrEqualRole(roles.admin))
  .delete(async (req, res) => {
    const { token } = req;
    const { uid, role } = req.body;
    let newRoles: string[] = [];

    const userRoles = token?.roles ?? [];

    if (Array.isArray(userRoles))
      newRoles = userRoles.filter((userRole) => userRole !== role);

    const [, error] = await tryCatch(
      adminAuth.setCustomUserClaims(uid, { roles: newRoles })
    );

    if (error) res.status(400).json({ message: 'Failed to add role', error });

    const [data, errorUser] = await tryCatch(adminAuth.getUser(uid));

    if (errorUser)
      res.status(400).json({ message: 'Failed to get user', error });

    res.status(200).json({ message: 'Role added successfully!', data });
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(500).end('Server error!');
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ message: 'Invalid Request Method' });
  },
});
