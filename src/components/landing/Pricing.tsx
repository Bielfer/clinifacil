import paths from '@/constants/paths';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { FC, useState } from 'react';
import MyLink from '../core/MyLink';

const frequencies = [
  { value: 'monthly', label: 'Mensal', suffix: 'mês', price: 'R$80' },
  { value: 'annually', label: 'Anual', suffix: 'ano', price: 'R$800' },
];

const features = [
  'Prontuário',
  'Assistentes Ilimitadas',
  'Suporte em menos de 10 minutos',
];

const Pricing: FC = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div id="pricing" className="bg-white pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simples, sem trocadilhos
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Pague uma taxa mensal fixa e tenha acesso a todas as nossas
            funcionalidades
          </p>
        </div>
        <div className="flex justify-center py-10">
          <RadioGroup
            value={frequency}
            onChange={setFrequency}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">
              Frequência de Pagamento
            </RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  clsx(
                    checked ? 'bg-primary-600 text-white' : 'text-gray-500',
                    'cursor-pointer rounded-full py-1 px-2.5'
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="mx-auto max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
          <div className="flex flex-col justify-center p-6 lg:flex-auto">
            <div className="flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-semibold leading-6 text-primary-600">
                O que está incluso
              </h4>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
              {features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-primary-600"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div className="rounded-2xl bg-gray-50 py-3 text-center ring-1 ring-inset ring-gray-900/5 sm:py-6 lg:flex lg:flex-col lg:justify-center">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-gray-600">
                  Pague todo {frequency.suffix} o mesmo valor
                </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    {frequency.price}
                  </span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                    /{frequency.suffix}
                  </span>
                </p>
                <MyLink
                  href={paths.contact}
                  variant="button-primary"
                  className="mt-4 w-full justify-center"
                >
                  Comprar
                </MyLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
