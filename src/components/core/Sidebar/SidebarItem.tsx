import { SidebarItem as SidebarItemType } from '@/types/sidebar';
import clsx from 'clsx';
import Link from 'next/link';

interface Props {
  item: SidebarItemType;
  current: boolean;
}

const SidebarItem = ({ item, current }: Props) => (
  <Link
    href={item.href}
    className={clsx(
      current
        ? 'bg-white text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition'
    )}
  >
    <item.icon
      className={clsx(
        current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
        'mr-3 h-6 w-6 flex-shrink-0 transition'
      )}
      aria-hidden="true"
    />
    {item.text}
  </Link>
);

export default SidebarItem;
