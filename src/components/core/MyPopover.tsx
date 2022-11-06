import { Popover, Transition } from '@headlessui/react';
import { ElementType, Fragment, ReactNode } from 'react';
import MyLink from '@/components/core/MyLink';
import clsx from 'clsx';

interface FunctionChildrenProps {
  open: boolean;
}

interface Props {
  data: Array<{ text: string; route: string }>;
  className?: string;
  classNameContainer?: string;
  children?: ReactNode | (({ open }: FunctionChildrenProps) => ReactNode);
  buttonAs?: ElementType;
}

const MyPopover = ({
  data,
  className,
  classNameContainer,
  children,
  buttonAs,
}: Props) => (
  <Popover className={clsx(className, 'relative')}>
    {({ open, close }) => (
      <>
        <Popover.Button
          as={buttonAs ?? 'button'}
          className="relative flex items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        >
          {typeof children === 'function' ? children({ open }) : children}
        </Popover.Button>
        <Transition.Root>
          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-150 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Popover.Overlay className="fixed inset-0" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="duration-150 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              as="ul"
              className={clsx(
                'absolute top-full mt-4 origin-top space-y-4 rounded-2xl bg-white p-6 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5',
                classNameContainer
              )}
            >
              {data.map((item) => (
                <li className="w-full" key={item.route}>
                  <MyLink href={item.route} onClick={() => close()}>
                    {item.text}
                  </MyLink>
                </li>
              ))}
            </Popover.Panel>
          </Transition.Child>
        </Transition.Root>
      </>
    )}
  </Popover>
);

export default MyPopover;
