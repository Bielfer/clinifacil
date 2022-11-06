import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import TableBody from './TableBody';
import TableData from './TableData';
import TableHead from './TableHead';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

interface TableType {
  Head: typeof TableHead;
  Header: typeof TableHeader;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Data: typeof TableData;
}

interface Props {
  children: ReactNode;
  className?: string;
}

const Table: FC<Props> & TableType = ({ children, className }) => (
  <div className={clsx('flex flex-col', className)}>
    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-slate-300">
            {children}
          </table>
        </div>
      </div>
    </div>
  </div>
);

Table.Head = TableHead;
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Data = TableData;

export default Table;
