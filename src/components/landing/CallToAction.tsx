import { FC } from 'react';
import MyLink from '../core/MyLink';

const CallToAction: FC = () => (
  <section className="bg-white">
    <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 sm:py-32 lg:px-8 ">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Melhore a produtividade da sua clínica
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
          Caso você não fique satisfeito reembolsamos seu dinheiro na hora
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <MyLink href="#" variant="button-primary">
            Começar Teste
          </MyLink>
          <MyLink href="#" variant="primary">
            <span>Saber Mais</span> <span aria-hidden="true"> →</span>
          </MyLink>
        </div>
      </div>
    </div>
  </section>
);

export default CallToAction;
