import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface Props<ValueType> {
  value: ValueType;
  setValue: (value: ValueType) => void;
  data: Array<{ value: ValueType; text: string }>;
  className?: string;
  classNameItemsContainer?: string;
  defaultText?: string;
}

const Dropdown = <T,>({
  value,
  setValue,
  data,
  className,
  classNameItemsContainer,
  defaultText,
}: Props<T>) => (
  <div className={className}>
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 hover:bg-opacity-30 focus:border-primary-600 focus:outline-none focus:ring-primary-600 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {data.find((item) => item.value === value)?.text ??
            defaultText ??
            'Selecione'}
          <ChevronDownIcon
            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            'absolute mt-2 w-56 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            classNameItemsContainer ?? 'right-0'
          )}
        >
          <div className="px-1 py-1 ">
            {data.map((item) => (
              <Menu.Item key={item.text + item.value}>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? 'bg-primary-600 text-white' : 'text-slate-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => setValue(item.value)}
                  >
                    {item.text}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  </div>
);

export default Dropdown;
