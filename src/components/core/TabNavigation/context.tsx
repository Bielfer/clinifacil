import React, { useContext } from 'react';

interface ContextType {
  activeStyles: string;
}

export const TabNavigationContext = React.createContext({} as ContextType);

export const useTabNavigation = () => useContext(TabNavigationContext);
