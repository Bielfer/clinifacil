import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const TableHead: FC<Props> = ({ children }) => (
  <thead className="bg-slate-50">
    <tr>{children}</tr>
  </thead>
);

export default TableHead;
