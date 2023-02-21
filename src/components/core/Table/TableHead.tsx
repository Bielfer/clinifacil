import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const TableHead: FC<Props> = ({ children }) => (
  <thead>
    <tr>{children}</tr>
  </thead>
);

export default TableHead;
