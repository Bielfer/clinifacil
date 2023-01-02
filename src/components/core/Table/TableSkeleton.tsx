import type { FC } from 'react';
import TableData from './TableData';
import TableRow from './TableRow';

interface Props {
  rows: number;
  columns: number;
}

const TableSkeleton: FC<Props> = ({ columns, rows }) => (
  <>
    {Array.from(Array(rows).keys()).map((row) => (
      <TableRow key={row}>
        {Array.from(Array(columns).keys()).map((column) => (
          <TableData key={column}>
            <div className="h-2 w-2/3 animate-pulse rounded-full bg-slate-200" />
          </TableData>
        ))}
      </TableRow>
    ))}
  </>
);

export default TableSkeleton;
