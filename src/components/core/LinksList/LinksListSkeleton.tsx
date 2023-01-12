import type { FC } from 'react';
import LinksList from './LinksList';

type Props = {
  rows: number;
};

const LinksListSkeleton: FC<Props> = ({ rows }) => (
  <LinksList>
    {Array.from(Array(rows).keys()).map((row) => (
      <LinksList.Item href="" key={row}>
        <div className="h-4 w-11/12 animate-pulse rounded-full bg-slate-200" />
      </LinksList.Item>
    ))}
  </LinksList>
);

export default LinksListSkeleton;
