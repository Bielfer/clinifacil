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
        'rounded-lg border bg-white transition duration-300',
        hoverableStyles,
        shadowStyles,
        className
      )}
    >
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  );
};

export default Card;
