import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import Link from '../MyLink';
import { useTabNavigation } from './context';

interface Props {
  className?: string;
  href: string;
  activeDot?: boolean;
  children?: string | ReactElement;
}

const TabNavigationTab = ({ className, children, href, activeDot }: Props) => {
  const router = useRouter();
  const { activeStyles } = useTabNavigation();

  const isActive = router.pathname === href;
  const activeStylesClassName = isActive ? activeStyles : '';
  const showDot = isActive && activeDot;

  return (
    <Link
      className={`flex items-center gap-x-2 ${activeStylesClassName} ${className}`}
      href={href}
    >
      {showDot ? <div className="bg-primary-light h-2 w-2 rounded-sm" /> : null}
      <span>{children}</span>
    </Link>
  );
};

export default TabNavigationTab;
