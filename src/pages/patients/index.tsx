import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import PatientSearch from '@/components/features/patient/PatientSearch';
import paths, { sidebarPaths } from '@/constants/paths';
import { useRoles } from '@/hooks';
import useReceptionistStore from '@/store/receptionist';
import { Page } from '@/types/auth';
import Head from 'next/head';
import SelectDoctor from '@/components/features/receptionist/SelectDoctor';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import EmptyState from '@/components/core/EmptyState';
import MyLink from '@/components/core/MyLink';
import { PlusIcon } from '@heroicons/react/20/solid';

const Patients: Page = () => {
  const { isReceptionist } = useRoles();
  const selectedDoctorId = useReceptionistStore(
    (state) => state.selectedDoctorId
  );

  return (
    <>
      <Head>
        <title>CliniFácil | Pacientes</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="mb-6 flex items-center justify-between">
          <Text h2>Procure o Paciente</Text>
          <div className="flex flex-col-reverse items-end gap-y-2 sm:flex-row sm:items-center sm:gap-y-0 sm:gap-x-4">
            {isReceptionist && <SelectDoctor />}
            <MyLink
              href={paths.newPatient}
              iconLeft={PlusIcon}
              variant="button-primary"
            >
              Novo Paciente
            </MyLink>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center pt-6">
            {isReceptionist && !selectedDoctorId ? (
              <EmptyState
                icon={CursorArrowRaysIcon}
                title="Nenhum médico selecionado"
                subtitle="Para selecionar um médico basta clicar no seletor acima"
              />
            ) : (
              <div className="w-full">
                <PatientSearch />
                <Text className="mt-2 mb-4 text-gray-500" p>
                  Você pode procurar o paciente por nome ou CPF.
                </Text>
                <div className="flex flex-col gap-y-3">
                  <Text b>Exemplos:</Text>
                  <Text className="gap-x-1">
                    <Text b>Nome: </Text>João Silva
                  </Text>
                  <Text className="gap-x-1">
                    <Text b>CPF: </Text>12345678910
                  </Text>
                  <Text className="gap-x-1">
                    <Text b>Nome e CPF: </Text>João Silva 12345678910
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </>
  );
};

Patients.auth = 'block';
Patients.allowHigherOrEqualRole = 'RECEPTIONIST';

export default Patients;
