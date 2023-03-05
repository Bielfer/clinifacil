import paths from '@/constants/paths';
import Logo from '../core/Logo';
import MyLink from '../core/MyLink';

const Footer = () => (
  <footer className="bg-slate-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center py-16">
        <Logo />
        <nav className="mt-10 text-sm" aria-label="quick links">
          <ul className="-my-1 flex justify-center space-x-6">
            <li>
              <MyLink href={paths.features} variant="secondary">
                Como Funciona?
              </MyLink>
            </li>
            <li>
              <MyLink href={paths.pricing} variant="secondary">
                Preços
              </MyLink>
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
