import { BookOpenIcon } from '@heroicons/react/24/outline';

const paths = {
  home: '/',
  pricing: '/#pricing',
  features: '/#features',
  login: '/login',
  records: '/records',
} as const;

export const sidebarPaths = [
  { text: 'Prontuário', href: '/records', icon: BookOpenIcon },
] as const;

export default paths;
