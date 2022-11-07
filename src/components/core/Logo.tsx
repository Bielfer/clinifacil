import paths from '@/constants/paths';
import Link from 'next/link';

const Logo = () => (
  <Link
    href={paths.home}
    className="flex items-center gap-x-2 text-2xl text-primary-600 font-medium font-['Nunito']"
  >
    <span className="sr-only">Home</span>
    ezClin
  </Link>
);

export default Logo;
