import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  hoverable?: boolean;
  shadow?: boolean;
  className?: string;
}

const Card = ({ children, hoverable, shadow, className }: Props) => {
  const hoverableStyles = hoverable ? ' hover:shadow-lg' : '';
  const shadowStyles = shadow ? ' shadow-lg hover:shadow-xl' : '';
  return (
    <div
      className={clsx(
        'border rounded-lg transition duration-300',
        hoverableStyles,
        shadowStyles,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
