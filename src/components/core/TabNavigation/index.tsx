/* eslint no-console:off */
import { ReactElement, useMemo } from 'react';
import { TabNavigationContext } from './context';
import TabNavigationTab from './TabNavigationTab';

interface SubComponents {
  Tab: typeof TabNavigationTab;
}

interface Props {
  className?: string;
  activeStyles?: string;
  children?: ReactElement;
}

const TabNavigation: SubComponents = ({
  children,
  className,
  activeStyles,
}: Props) => {
  if (!Array.isArray(children))
    console.error('TabNavigation should have more than 1 child!');

  const value = useMemo(
    () => ({
      activeStyles: activeStyles || '',
    }),
    [activeStyles]
  );

  return (
    <TabNavigationContext.Provider value={value}>
      <div className={`flex items-center ${className}`}>{children}</div>
    </TabNavigationContext.Provider>
  );
};

TabNavigation.Tab = TabNavigationTab;

export default TabNavigation;
