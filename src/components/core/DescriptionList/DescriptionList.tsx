import clsx from 'clsx';
import type { FC, ReactElement } from 'react';
import MyLink from '../MyLink';

type Props = {
  items: {
    label: string;
    value?: string | number | null;
    buttonsOrLinks?: ReactElement[];
  }[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  className?: string;
  link?: { text: string; href: string };
};

const DescriptionList: FC<Props> = ({
  items,
  title,
  subtitle,
  loading,
  className,
  link,
}) => {
  const anyButtonOrLinkPresent = items.some((item) => !!item.buttonsOrLinks);

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
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
      )}
      <dl className="divide-y divide-gray-200">
        {items.map((item) => (
          <div
            className={clsx(
              'py-4 sm:grid sm:gap-4 sm:py-5',
              anyButtonOrLinkPresent ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            )}
            key={item.value + item.label}
          >
            <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
            <dd
              className={clsx(
                'mt-1 flex items-center text-sm text-gray-900 sm:mt-0',
                anyButtonOrLinkPresent ? 'sm:col-span-2' : 'sm:col-span-1'
              )}
            >
              {loading ? (
                <span className="h-2 w-2/3 animate-pulse rounded-full bg-slate-200">
                  {' '}
                </span>
              ) : (
                <span className="flex-grow">{item.value}</span>
              )}
              {!!item.buttonsOrLinks && (
                <span className="flex flex-shrink-0 items-center gap-x-2">
                  {item.buttonsOrLinks.map((buttonOrLink) => (
                    <>
                      <span
                        className="text-gray-300 first:hidden"
                        aria-hidden="true"
                      >
                        |
                      </span>
                      {buttonOrLink}
                    </>
                  ))}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default DescriptionList;
