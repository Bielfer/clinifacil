import Text from '@/components/core/Text';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  name?: string;
  children: ReactNode;
  shadow?: boolean;
}

const InputLayout = ({
  label,
  hint,
  error,
  className,
  name,
  children,
  shadow,
}: Props) => (
  <div className={className}>
    {label && (
      <div className="flex justify-between">
        <Text htmlFor={name} label>
          {label}
        </Text>
        {hint && (
          <span className="text-sm text-gray-500" id="email-optional">
            {hint}
          </span>
        )}
      </div>
    )}
    <div className={clsx('relative mt-1', shadow && 'shadow-sm')}>
      {children}

      {!!error && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
    {!!error && (
      <p className="mt-2 text-sm text-red-600" id="error">
        {error}
      </p>
    )}
  </div>
);

export default InputLayout;
