/* eslint @next/next/no-img-element:off */
import { useRef, useState } from 'react';
import { Combobox } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Button from '@/components/core/Button';
import MyLink from '@/components/core/MyLink';
import { format } from 'date-fns';
import { formatCPF } from '@/helpers/formatters';
import { trpc } from '@/services/trpc';
import { useOnClickOutside, useRoles, useTimeout } from '@/hooks';
import paths from '@/constants/paths';
import { useRouter } from 'next/router';
import useReceptionistStore from '@/store/receptionist';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/core/Toast';

type Props = {
  className?: string;
};

const PatientSearch = ({ className }: Props) => {
  const router = useRouter();
  const { isDoctor } = useRoles();
  const { addToast } = useToast();
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const { data: patients } = trpc.patient.getMany.useQuery(
    { search: query },
    { enabled: query.length >= 3 }
  );
  const [selectedPatient, setSelectedPatient] = useState(patients?.[0]);
  const { reset } = useTimeout(() => setQuery(input), 500);
  const inputRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(inputRef, () => setInput(''));
  const {
    isLoading: isCreatingAppointment,
    isError: failedToCreateAppointment,
    mutateAsync: createAppointment,
  } = trpc.appointment.create.useMutation();
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );
  const { data: doctor } = trpc.doctor.get.useQuery(
    { userId: session?.user.id },
    { enabled: isDoctor }
  );

  const handleButtonCreateAppointment = async (patientId: number) => {
    await createAppointment({
      doctorId: (isDoctor ? doctor?.id : selectedDoctorId) ?? 0,
      patientId,
    });

    if (failedToCreateAppointment) {
      addToast({
        type: 'error',
        content: 'Houve algum problema ao criar a consulta, tente novamente!',
      });
      return;
    }

    router.push(paths.queue);
  };

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
                'absolute flex w-full justify-center divide-gray-100 rounded-b-lg border border-t-0 border-gray-100 bg-white',
                patients.length > 0 && 'divide-x'
              )}
            >
              <div
                className={clsx(
                  'max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4',
                  (input === '' || patients.length === 0) && 'hidden'
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
                          active && 'bg-gray-100 text-gray-900'
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
                              className="ml-3 h-5 w-5 flex-none text-gray-400"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </div>
              </div>

              {activeOption && (
                <div className="hidden w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                  <div className="flex flex-auto flex-col justify-between p-6">
                    <dl className="grid grid-cols-2 items-center gap-x-4 gap-y-3 text-sm text-gray-700">
                      <dt className="font-semibold text-gray-900">Nome</dt>
                      <dd>{activeOption.name}</dd>
                      {activeOption.cpf && (
                        <>
                          <dt className="font-semibold text-gray-900">CPF</dt>
                          <dd>{formatCPF(activeOption.cpf)}</dd>
                        </>
                      )}
                      {activeOption.birthDate && (
                        <>
                          <dt className="font-semibold text-gray-900">
                            Data de Nascimento
                          </dt>
                          <dd>
                            {format(activeOption.birthDate, 'dd/MM/yyyy')}
                          </dd>
                        </>
                      )}
                    </dl>
                    <div className="flex flex-col items-end justify-between gap-y-2 pt-4 lg:flex-row lg:items-center">
                      <MyLink
                        href={paths.patientsById(activeOption.id)}
                        variant="button-secondary"
                      >
                        Ver Paciente
                      </MyLink>
                      <Button
                        variant="primary"
                        loading={isCreatingAppointment}
                        onClick={() =>
                          handleButtonCreateAppointment(activeOption.id)
                        }
                      >
                        Colocar na Fila
                      </Button>
                    </div>
                  </div>
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
            </Combobox.Options>
          )}
        </div>
      )}
    </Combobox>
  );
};

export default PatientSearch;
