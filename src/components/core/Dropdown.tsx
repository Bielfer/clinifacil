import { Menu, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  data: Array<{ value: string; text: string }>;
  className?: string;
  classNameItemsContainer?: string;
}

const Dropdown = ({
  value,
  setValue,
  data,
  className,
  classNameItemsContainer,
}: Props) => (
  <div className={className}>
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-slate-300 shadow-sm bg-opacity-20 px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus:ring-primary-600 focus:border-primary-600">
          {data.find((item) => item.value === value)?.text ?? 'Selecione'}
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
              <Menu.Item key={item.value}>
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
