import Spinner from './Spinner';

interface Props {
  loading: boolean;
  children: JSX.Element;
}

const LoadingWrapper = ({ loading, children }: Props) => {
  if (loading)
    return (
      <div className="flex justify-center pt-6">
        <Spinner size="lg" />
      </div>
    );

  return children;
};

export default LoadingWrapper;
