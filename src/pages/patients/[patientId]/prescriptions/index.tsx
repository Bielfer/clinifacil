import Button from '@/components/core/Button';
import DescriptionList from '@/components/core/DescriptionList';
import EmptyState from '@/components/core/EmptyState';
import IconButton from '@/components/core/IconButton';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import { useToast } from '@/components/core/Toast';
import PrescriptionPrintable from '@/components/features/printables/PrescriptionPrintable';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import tryCatch from '@/helpers/tryCatch';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/20/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PatientPrescriptions: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const {
    data: prescriptions,
    isLoading: isLoadingPrescriptions,
    refetch: refetchPrescriptions,
  } = trpc.prescription.getMany.useQuery({
    patientId: parseInt(patientId, 10),
  });
  const {
    mutateAsync: deletePrescription,
    variables: deleteParameters,
    isLoading: isDeletingPrescription,
  } = trpc.prescription.delete.useMutation();
  const { data: session } = useSession();
  const { data: doctor } = trpc.doctor.get.useQuery(
    { userId: session?.user.id },
    { enabled: !!session }
  );
  const { data: patient } = trpc.patient.getById.useQuery({
    id: parseInt(patientId, 10),
  });
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

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
        <title>CliniFácil | Receita do Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between">
          <Text h2>Receita do Paciente</Text>
          <div className="flex flex-col-reverse items-end gap-y-2 pl-3 sm:flex-row sm:items-center sm:gap-y-0 sm:gap-x-3">
            <Button
              iconLeft={PrinterIcon}
              variant="secondary"
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <div className="hidden">
              <PrescriptionPrintable
                ref={printRef}
                doctor={doctor}
                prescriptions={prescriptions ?? []}
                patient={patient}
              />
            </div>
            <MyLink
              href={paths.newPatientPrescriptions(patientId)}
              iconLeft={PlusIcon}
              variant="button-primary"
            >
              Novo Remédio
            </MyLink>
          </div>
        </div>
        <TabsNavigation
          className="pt-2 pb-6"
          tabs={patientAppointmentPaths({ patientId })}
        />
        <LoadingWrapper loading={isLoadingPrescriptions}>
          {!!prescriptions && prescriptions.length > 0 ? (
            <DescriptionList
              title="Remédios"
              className="mx-auto max-w-2xl pt-5"
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
                        onClick={() =>
                          handleDeletePrescription(prescription.id)
                        }
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
                        onClick={() =>
                          handleDeletePrescription(prescription.id)
                        }
                      />
                    </>,
                  ],
                })) ?? []
              }
            />
          ) : (
            <EmptyState
              icon={DocumentTextIcon}
              title="Nenhum remédio adicionado à receita"
              subtitle="Para adicionar um novo remédio basta clicar no botão Novo Remédio"
            />
          )}
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

PatientPrescriptions.auth = 'block';
PatientPrescriptions.allowHigherOrEqualRole = 'DOCTOR';

export default PatientPrescriptions;
