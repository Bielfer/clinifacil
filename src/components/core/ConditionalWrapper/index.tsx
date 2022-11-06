import { FC, ReactNode } from 'react';

interface Props {
  condition: boolean;
  renderWrapper: (children: ReactNode) => ReactNode;
  children: any;
}

const ConditionalWrapper: FC<Props> = ({
  children,
  condition,
  renderWrapper,
}) => (condition ? renderWrapper(children) : children);

export default ConditionalWrapper;
