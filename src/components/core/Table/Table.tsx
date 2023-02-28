import clsx from 'clsx';
import { forwardRef, ReactNode } from 'react';
import TableBody from './TableBody';
import TableData from './TableData';
import TableHead from './TableHead';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableSkeleton from './TableSkeleton';

interface Props {
  children: ReactNode;
  className?: string;
}

const Table = forwardRef<HTMLTableElement, Props>(
  ({ children, className }, ref) => (
    <div className={clsx('flex flex-col', className)}>
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300" ref={ref}>
            {children}
          </table>
        </div>
      </div>
    </div>
  )
);

export default Object.assign(Table, {
  Head: TableHead,
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Data: TableData,
  Skeleton: TableSkeleton,
});
