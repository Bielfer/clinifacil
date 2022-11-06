import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const TableBody: FC<Props> = ({ children }) => (
  <tbody className="divide-y divide-slate-200 bg-white">{children}</tbody>
);

export default TableBody;
