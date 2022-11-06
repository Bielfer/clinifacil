import { FC, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

const TableRow: FC<Props> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
);

export default TableRow;
