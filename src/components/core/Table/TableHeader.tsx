import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import ConditionalWrapper from '../ConditionalWrapper';

interface Props {
  children: ReactNode;
  hidden?: boolean;
  className?: string;
}

const TableHeader: FC<Props> = ({ children, hidden, className }) => (
  <th
    scope="col"
    className={clsx(
      'py-3.5 px-3 text-left text-sm font-semibold text-slate-900 first:pl-6 last:pr-6 first:sm:pl-0 last:sm:pr-0',
      className
    )}
  >
    <ConditionalWrapper
      condition={!!hidden}
      renderWrapper={(wrapperChildren) => (
        <span className="sr-only">{wrapperChildren}</span>
      )}
    >
      {children}
    </ConditionalWrapper>
  </th>
);

export default TableHeader;
