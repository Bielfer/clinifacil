import clsx from 'clsx';
import { useRouter } from 'next/router';
import MyLink from './MyLink';

interface Tab {
  text: string;
  href: string;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
}

interface Props {
  tabs: Array<Tab>;
  className?: string;
}

const Tabs = ({ tabs, className }: Props) => {
  const router = useRouter();

  return (
    <nav
      className={clsx(
        '-mb-px flex gap-x-8 max-w-full overflow-x-auto',
        className
      )}
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const isCurrentTab = router.asPath === tab.href;

        return (
          <MyLink
            key={tab.href + tab.text}
            href={tab.href}
            className={clsx(
              isCurrentTab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap'
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

export default Tabs;
