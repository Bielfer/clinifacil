import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const TableData: FC<Props> = ({ children, className }) => (
  <td
    className={clsx(
      'whitespace-nowrap py-4 px-3 text-sm text-slate-900 first:pl-6 last:pr-6 first:sm:pl-0 last:sm:pr-0',
      className
    )}
  >
    {children}
  </td>
);

export default TableData;
