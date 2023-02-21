import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const TableData: FC<Props> = ({ children, className }) => (
  <td
    className={clsx(
      'whitespace-nowrap py-4 px-4 text-sm text-slate-900 first:sm:pl-6 last:sm:pr-6',
      className
    )}
  >
    {children}
  </td>
);

export default TableData;
