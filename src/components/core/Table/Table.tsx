import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import TableBody from './TableBody';
import TableData from './TableData';
import TableHead from './TableHead';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableSkeleton from './TableSkeleton';

interface TableType {
  Head: typeof TableHead;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Data: typeof TableData;
  Skeleton: typeof TableSkeleton;
}

interface Props {
  children: ReactNode;
  className?: string;
}

const Table: FC<Props> & TableType = ({ children, className }) => (
  <div className={clsx('flex flex-col', className)}>
    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table className="min-w-full divide-y divide-gray-300">
          {children}
        </table>
      </div>
    </div>
  </div>
);

Table.Head = TableHead;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Data = TableData;
Table.Skeleton = TableSkeleton;

export default Table;
