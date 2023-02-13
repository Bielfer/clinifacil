/* eslint @next/next/no-img-element:off */
import { FC, useEffect, useRef, useState } from 'react';
import { Combobox } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import MyLink from '@/components/core/MyLink';
import { formatCPF } from '@/helpers/formatters';
import { trpc } from '@/services/trpc';
import { useOnClickOutside, useTimeout } from '@/hooks';
import paths from '@/constants/paths';
import type { Patient } from '@prisma/client';
import PatientData from './PatientData';

type Props = {
  className?: string;
};

const PatientSearch: FC = ({ className }: Props) => {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const { data: patients } = trpc.patient.getMany.useQuery(
    { search: query },
    { enabled: query.length >= 3 }
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>();
  const { reset, clear } = useTimeout(() => setQuery(input), 500);
  const inputRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(inputRef, () => setInput(''));

  useEffect(
    () => () => {
      clear();
    },
    [clear]
  );

  return (
    <Combobox
      onChange={(patient) => setSelectedPatient(patient)}
      value={selectedPatient}
    >
      {({ activeOption }) => (
        <div className={clsx('relative', className)} ref={inputRef}>
          <div
            className={clsx(
              `rounded-t-lg border border-gray-300 bg-white`,
              input === '' && 'rounded-b-lg'
            )}
          >
            <MagnifyingGlassIcon
              className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <Combobox.Input
              className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
              placeholder="Procurar..."
              onChange={(event) => {
                reset();
                setInput(event.target.value);
              }}
            />
          </div>

          {input !== '' && !!patients && (
            <Combobox.Options
              as="div"
              static
              hold
              className={clsx(
                'absolute flex w-full justify-center divide-gray-100 rounded-b-lg border border-t-0 border-gray-300 bg-white',
                patients.length > 0 && 'sm:divide-x'
              )}
            >
              <>
                <div
                  className={clsx(
                    'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4',
                    (input === '' || patients.length === 0) && 'hidden',
                    !!selectedPatient && 'hidden sm:block'
                  )}
                >
                  <div className="-mx-2 text-sm text-gray-700">
                    {(input === '' ? [] : patients).map((patient) => (
                      <Combobox.Option
                        as="div"
                        key={patient.id}
                        value={patient}
                        className={({ active }) =>
                          clsx(
                            'flex cursor-default select-none items-center rounded-md p-2',
                            active && 'text-gray-900 sm:bg-gray-100'
                          )
                        }
                      >
                        {({ active }) => (
                          <>
                            <span className="ml-3 flex-auto truncate">
                              {patient.name}
                              {patient.cpf && (
                                <span className="md:hidden">
                                  {' - '}
                                  {formatCPF(patient.cpf)}
                                </span>
                              )}
                            </span>
                            {active && (
                              <ChevronRightIcon
                                className="ml-3 hidden h-5 w-5 flex-none text-gray-400 sm:block"
                                aria-hidden="true"
                              />
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                </div>

                {(activeOption || selectedPatient) && (
                  <div
                    className={clsx(
                      'w-full flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex sm:w-1/2',
                      selectedPatient ? 'flex' : 'hidden'
                    )}
                  >
                    <PatientData
                      patient={activeOption ?? selectedPatient}
                      setSelectedPatient={setSelectedPatient}
                    />
                  </div>
                )}
                {input !== '' && patients.length === 0 && (
                  <div className="py-8 px-6 text-center text-sm sm:px-14">
                    <UsersIcon
                      className="mx-auto h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                    <p className="mt-4 font-semibold text-gray-900">
                      Paciente não encontrado
                    </p>
                    <p className="mt-2 mb-6 text-gray-500">
                      Para adicionar o paciente no sistema basta clicar no botão
                      abaixo!
                    </p>
                    <MyLink
                      href={paths.newPatient}
                      variant="button-primary"
                      iconLeft={PlusIcon}
                    >
                      Criar Paciente
                    </MyLink>
                  </div>
                )}
              </>
            </Combobox.Options>
          )}
        </div>
      )}
    </Combobox>
  );
};

export default PatientSearch;
