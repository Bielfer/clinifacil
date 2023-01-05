import Card from '@/components/core/Card';
import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import PatientSearch from '@/components/features/patient/PatientSearch';
import { sidebarPaths } from '@/constants/paths';
import { useRoles } from '@/hooks';
import useReceptionistStore from '@/store/receptionist';
import { Page } from '@/types/auth';
import Head from 'next/head';
import NoDoctorSelectedMessage from '@/components/features/receptionist/NoDoctorSelectedMessage';
import SelectDoctor from '@/components/features/receptionist/SelectDoctor';

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
        <div className="flex items-center justify-between">
          <Text h2>Pacientes</Text>
          {isReceptionist && <SelectDoctor />}
        </div>
        <div className="flex justify-center pt-12">
          {isReceptionist && !selectedDoctorId ? (
            <NoDoctorSelectedMessage />
          ) : (
            <Card className="w-full max-w-3xl">
              <Text h3 className="mb-6">
                Procure o Paciente
              </Text>
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
            </Card>
          )}
        </div>
      </Sidebar>
    </>
  );
};

Patients.auth = 'block';

export default Patients;
