import { isHigherOrEqualInRoleHierarchy } from '@/helpers/roles';
import { IconType } from '@/types/core';
import { Role } from '@/types/role';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC } from 'react';
import MyLink from './MyLink';

interface Tab {
  text: string;
  href: string;
  icon?: IconType;
  role?: Role;
}

interface Props {
  tabs: Array<Tab>;
  className?: string;
}

const TabsNavigation: FC<Props> = ({ tabs, className }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav
      className={clsx(
        '-mb-px flex max-w-full gap-x-8 overflow-x-auto',
        className
      )}
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const isCurrentTab = router.asPath === tab.href;

        if (
          tab.role &&
          !isHigherOrEqualInRoleHierarchy(session?.user.role, tab.role)
        )
          return null;

        return (
          <MyLink
            key={tab.href + tab.text}
            href={tab.href}
            className={clsx(
              isCurrentTab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700',
              'group inline-flex items-center whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
            )}
          >
            {tab.icon && (
              <tab.icon
                className={clsx(
                  isCurrentTab
                    ? 'text-primary-500'
                    : 'text-slate-400 group-hover:text-slate-500',
                  '-ml-0.5 mr-2 h-5 w-5'
                )}
                aria-hidden="true"
              />
            )}

            {tab.text}
          </MyLink>
        );
      })}
    </nav>
  );
};

export default TabsNavigation;
