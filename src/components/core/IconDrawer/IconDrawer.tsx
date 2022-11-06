import clsx from 'clsx';

interface Props {
  isOpen: boolean;
}

const IconDrawer = ({ isOpen }: Props) => (
  <>
    <span className="sr-only">Abrir/Fechar Menu</span>
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx('origin-center transition', {
          'scale-90 opacity-0': isOpen,
        })}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx('origin-center transition', {
          'scale-90 opacity-0': !isOpen,
        })}
      />
    </svg>
  </>
);

export default IconDrawer;
