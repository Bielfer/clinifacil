import paths from '@/constants/paths';
import Link from 'next/link';

const Logo = () => (
  <Link
    href={paths.home}
    className="font-nunito flex items-center gap-x-2 text-2xl font-medium text-primary-600"
  >
    <span className="sr-only">Home</span>
    CliniFácil
  </Link>
);

export default Logo;
