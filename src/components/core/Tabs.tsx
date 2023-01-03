import { IconType } from '@/types/core';
import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';

interface Tab<TabValueType> {
  text: string;
  value: TabValueType;
  icon?: IconType;
}

interface Props<ValueType> {
  tabs: Array<Tab<ValueType>>;
  className?: string;
  value: ValueType;
  setValue: Dispatch<SetStateAction<ValueType>>;
}

const Tabs = <T,>({ tabs, className, value, setValue }: Props<T>) => (
  <nav
    className={clsx(
      '-mb-px flex max-w-full gap-x-8 overflow-x-auto',
      className
    )}
    aria-label="Tabs"
  >
    {tabs.map((tab) => {
      const isCurrentTab = value === tab.value;

      return (
        <button
          key={tab.text}
          type="button"
          onClick={() => setValue(tab.value)}
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
        </button>
      );
    })}
  </nav>
);

export default Tabs;
