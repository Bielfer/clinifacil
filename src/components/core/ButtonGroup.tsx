import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import ConditionalWrapper from './ConditionalWrapper';

interface Button {
  text: string;
  onClick?: () => void;
  icon?: React.ComponentType<React.ComponentProps<'svg'>>;
  href?: string;
}

interface Props {
  buttons: Array<Button>;
  className?: string;
}

const ButtonGroup = ({ buttons, className }: Props) => (
  <span
    className={clsx(
      'relative z-0 inline-flex m rounded-md max-w-full overflow-auto',
      className
    )}
  >
    {buttons.map((button) => (
      <ConditionalWrapper
        key={button.text}
        condition={!!button.href}
        renderWrapper={(children) => (
          <Link href={button.href ?? '/'} passHref legacyBehavior>
            {children}
          </Link>
        )}
      >
        <button
          type="button"
          className="relative inline-flex items-center px-4 py-2 border-r-0 last:border-r first:rounded-l-md last:rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 whitespace-nowrap"
          onClick={button.onClick}
          role={button.href ? 'link' : 'button'}
        >
          {button.icon && (
            <button.icon
              className="-ml-1 mr-2 h-5 w-5 text-slate-400"
              aria-hidden="true"
            />
          )}
          {button.text}
        </button>
      </ConditionalWrapper>
    ))}
  </span>
);

export default ButtonGroup;
