import type { FC } from 'react';
import MyLink from '../MyLink';

type Props = {
  items: { label: string; value?: string | number | null }[];
  title: string;
  subtitle?: string;
  loading?: boolean;
  className?: string;
  link?: { text: string; href: string };
};

const List: FC<Props> = ({
  items,
  title,
  subtitle,
  loading,
  className,
  link,
}) => (
  <div className={className}>
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        {!!subtitle && (
          <p className="max-w-2xl text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {!!link && (
        <MyLink href={link.href} variant="button-secondary">
          {link.text}
        </MyLink>
      )}
    </div>
    <dl className="divide-y divide-gray-200">
      {items.map((item) => (
        <div
          className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
          key={item.value + item.label}
        >
          <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
          <dd className="mt-1 flex items-center text-sm text-gray-900 sm:col-span-2 sm:mt-0">
            {loading ? (
              <span className="h-2 w-2/3 animate-pulse rounded-full bg-slate-200">
                {' '}
              </span>
            ) : (
              <span className="flex-grow">{item.value}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default List;
