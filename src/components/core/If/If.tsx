/* eslint react/jsx-no-useless-fragment:off */
/* eslint no-console:off */
import type { FC, ReactNode } from 'react';
import IfCase from './IfCase';

type Props = {
  children: ReactNode;
};

type IfType = {
  Case: typeof IfCase;
};

const If: FC<Props> & IfType = ({ children }) => {
  if (!Array.isArray(children)) {
    console.error('Children should be an array!');
    return null;
  }

  const conditionIsTrueIndex = children.findIndex(
    (child) => child.props.condition
  );

  return <>{children[conditionIsTrueIndex]}</>;
};

If.Case = IfCase;

export default If;
