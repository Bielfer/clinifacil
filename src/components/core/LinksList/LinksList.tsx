import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import LinksListItem from './LinksListItem';

type Props = {
  children: ReactNode;
  className?: string;
};

type LinksListType = {
  Item: typeof LinksListItem;
};

const LinksList: FC<Props> & LinksListType = ({ children, className }) => (
  <div
    className={clsx('overflow-hidden bg-white shadow sm:rounded-md', className)}
  >
    <ul className="divide-y divide-gray-200">{children}</ul>
  </div>
);

LinksList.Item = LinksListItem;

export default LinksList;
