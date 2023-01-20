import Button from '@/components/core/Button';
import DescriptionList from '@/components/core/DescriptionList';
import IconButton from '@/components/core/IconButton';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import { useToast } from '@/components/core/Toast';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import tryCatch from '@/helpers/tryCatch';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientPrescriptions: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const { data: prescriptions, refetch: refetchPrescriptions } =
    trpc.prescription.getMany.useQuery({
      patientId: parseInt(patientId, 10),
    });
  const {
    mutateAsync: deletePrescription,
    variables: deleteParameters,
    isLoading: isDeletingPrescription,
  } = trpc.prescription.delete.useMutation();

  const handleDeletePrescription = async (prescriptionId: number) => {
    const [, error] = await tryCatch(
      deletePrescription({ id: prescriptionId })
    );

    if (error)
      addToast({
        type: 'error',
        content: 'Falha ao remover remédio, tente novamente em 5 segundos!',
      });

    await refetchPrescriptions();
  };

  return (
    <>
      <Head>
        <title>CliniFácil | Receitas do Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between">
          <Text h2>Receitas do Paciente</Text>
          <MyLink
            href={paths.newPatientPrescriptions(patientId)}
            iconLeft={PlusIcon}
            variant="button-primary"
          >
            Nova Receita
          </MyLink>
        </div>
        <TabsNavigation
          className="pt-2 pb-6"
          tabs={patientAppointmentPaths({ patientId })}
        />
        <DescriptionList
          className="mx-auto max-w-2xl"
          items={
            prescriptions?.map((prescription) => ({
              label: prescription.medicationName,
              buttonsOrLinks: [
                <>
                  <Button
                    className="hidden sm:inline-flex"
                    variant="link-error"
                    iconLeft={TrashIcon}
                    size="sm"
                    loading={
                      isDeletingPrescription &&
                      deleteParameters?.id === prescription.id
                    }
                    onClick={() => handleDeletePrescription(prescription.id)}
                  >
                    Apagar
                  </Button>
                  <IconButton
                    className="sm:hidden"
                    variant="link-error"
                    icon={TrashIcon}
                    size="lg"
                    loading={
                      isDeletingPrescription &&
                      deleteParameters?.id === prescription.id
                    }
                    onClick={() => handleDeletePrescription(prescription.id)}
                  />
                </>,
              ],
            })) ?? []
          }
        />
      </Sidebar>
    </>
  );
};

PatientPrescriptions.auth = 'block';
PatientPrescriptions.allowHigherOrEqualRole = 'DOCTOR';

export default PatientPrescriptions;
