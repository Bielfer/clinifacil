import Link from 'next/link';
import Logo from '../core/Logo';

const Footer = () => (
  <footer className="bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center py-16">
        <Logo />
        <nav className="mt-10 text-sm" aria-label="quick links">
          <ul className="-my-1 flex justify-center space-x-6">
            <li>
              <Link
                href="#features"
                className="rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Como Funciona?
              </Link>
            </li>
            <li>
              <Link
                href="#pricing"
                className="rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Preços
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-center border-t border-slate-400/10 py-10 sm:flex-row-reverse sm:justify-between">
        <p className="mt-6 text-sm text-slate-500 sm:mt-0">
          Copyright &copy; {new Date().getFullYear()} CliniFácil. Todos os
          direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
