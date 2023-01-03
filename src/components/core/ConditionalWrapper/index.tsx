/* eslint react/jsx-no-useless-fragment:off */
import { ReactNode } from 'react';

interface Props {
  condition: boolean;
  renderWrapper: (children: ReactNode) => ReactNode;
  children: ReactNode;
}

const ConditionalWrapper = ({ children, condition, renderWrapper }: Props) => (
  <>{condition ? renderWrapper(children) : children}</>
);

export default ConditionalWrapper;
