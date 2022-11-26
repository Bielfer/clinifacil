import { NextApiRequestExtended } from '@/types/api';
import { NextApiResponse } from 'next';

export const onErrorHandler = (
  err: unknown,
  req: NextApiRequestExtended,
  res: NextApiResponse<any>
) => {
  console.error(err);
  res.status(500).end('Server error!');
};

export const onNoMatchHandler = (
  req: NextApiRequestExtended,
  res: NextApiResponse<any>
) => {
  res.status(405).json({ message: 'Invalid Request Method' });
};
