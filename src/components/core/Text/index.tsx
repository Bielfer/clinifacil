import React, { FC, ReactNode } from 'react';
import { VariantText } from '@/types/styles';
import clsx from 'clsx';
import { IconType } from '@/types/core';

interface Props {
  className?: string;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  p?: boolean;
  b?: boolean;
  small?: boolean;
  i?: boolean;
  span?: boolean;
  del?: boolean;
  em?: boolean;
  blockquote?: boolean;
  label?: boolean;
  iconLeft?: IconType;
  iconRight?: IconType;
  htmlFor?: string;
  children?: ReactNode;
}

const elementStyles = {
  h1: 'text-3xl font-medium text-slate-900',
  h2: 'text-2xl font-medium text-slate-900',
  h3: 'text-xl font-medium text-slate-900',
  h4: 'text-lg font-medium text-slate-900',
  h5: 'text-base font-medium text-slate-900',
  h6: 'text-sm font-medium text-slate-900',
  p: '',
  b: 'font-semibold text-slate-900',
  small: '',
  i: '',
  span: '',
  del: '',
  em: '',
  blockquote: '',
  label: 'text-sm font-medium text-gray-700',
};

const Text: FC<Props> = ({
  className,
  children,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  b,
  small,
  i,
  span,
  del,
  em,
  blockquote,
  label,
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) => {
  const elements = {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    b,
    small,
    i,
    span,
    del,
    em,
    blockquote,
    label,
  };
  const elementArray = Object.keys(elements) as VariantText[];
  const element = elementArray.find((el) => elements[el] === true) ?? 'p';

  return (
    <>
      {React.createElement(
        element,
        {
          className: clsx(
            'flex items-center',
            elementStyles[element],
            className
          ),
          ...props,
        },
        IconLeft && <IconLeft className="-ml-0.5 mr-2 h-5 w-5 flex-shrink-0" />,
        children,
        IconRight && (
          <IconRight className="ml-2 -mr-0.5 h-5 w-5 flex-shrink-0" />
        )
      )}
    </>
  );
};

export default Text;
