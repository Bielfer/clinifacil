import { ChevronRightIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC, ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

const LinksListItem: FC<Props> = ({ href, children, className }) => (
  <li>
    <Link href={href} className={clsx('block hover:bg-gray-50', className)}>
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="flex flex-grow">{children}</div>

        <ChevronRightIcon
          className="h-5 w-5 flex-shrink-0 text-gray-400"
          aria-hidden="true"
        />
      </div>
    </Link>
  </li>
);

export default LinksListItem;
