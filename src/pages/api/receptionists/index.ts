/* eslint no-console:off */
import { roles } from '@/constants/roles';
import { addReceptionist } from '@/db/receptionist';
import { onErrorHandler, onNoMatchHandler } from '@/helpers/api';
import { getCompleteDocumentData } from '@/helpers/firebase';
import {
  authorizeHigherOrEqualRole,
  isAuthenticated,
  requestTimer,
  validateBody,
} from '@/helpers/middlewares';
import tryCatch from '@/helpers/tryCatch';
import { NextApiRequestExtended } from '@/types/api';
import { receptionistSchema } from '@/types/receptionist';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequestExtended, NextApiResponse>().use(
  requestTimer
);

router
  .use(validateBody(receptionistSchema))
  .use(isAuthenticated)
  .use(authorizeHigherOrEqualRole(roles.doctor))
  .post(async (req, res) => {
    const { body } = req;

    const [data, errorReceptionist] = await tryCatch(addReceptionist(body));

    if (errorReceptionist) {
      res.status(400).json({
        message: 'Failed to create receptionist',
        error: errorReceptionist,
      });
    }

    const receptionist = getCompleteDocumentData(await data?.get());

    res.status(200).json({
      message: 'Receptionist successfully created!',
      data: receptionist,
    });
  });

export default router.handler({
  onError: onErrorHandler,
  onNoMatch: onNoMatchHandler,
});
