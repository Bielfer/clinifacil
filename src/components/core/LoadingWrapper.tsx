import clsx from 'clsx';
import { FC } from 'react';
import Spinner from './Spinner';

interface Props {
  loading: boolean;
  children: JSX.Element;
  className?: string;
  hiddenChildren?: boolean;
}

const LoadingWrapper: FC<Props> = ({
  loading,
  children,
  className,
  hiddenChildren = false,
}) => {
  if (loading)
    return (
      <>
        <div className={clsx('flex justify-center', className)}>
          <Spinner size="lg" />
        </div>
        {hiddenChildren && <div className="hidden">{children}</div>}
      </>
    );

  return children;
};

export default LoadingWrapper;
