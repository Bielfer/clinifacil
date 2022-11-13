import { SidebarItem as SidebarItemType } from '@/types/sidebar';
import clsx from 'clsx';

interface Props {
  item: SidebarItemType;
  current: boolean;
}

const SidebarItem = ({ item, current }: Props) => (
  <a
    href={item.href}
    className={clsx(
      current
        ? 'bg-gray-100 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
    )}
  >
    <item.icon
      className={clsx(
        current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
        'mr-3 flex-shrink-0 h-6 w-6'
      )}
      aria-hidden="true"
    />
    {item.text}
  </a>
);

export default SidebarItem;
