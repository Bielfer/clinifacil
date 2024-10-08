import Button from '@/components/core/Button';
import DescriptionList from '@/components/core/DescriptionList';
import EmptyState from '@/components/core/EmptyState';
import IconButton from '@/components/core/IconButton';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import Modal from '@/components/core/Modal';
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
import { printableTypes } from '@/constants/printables';
import tryCatch from '@/helpers/tryCatch';
import { useActiveAppointment, useActiveDoctor } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/20/solid';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Printable } from '@prisma/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useReactToPrint } from 'react-to-print';

const PatientPrescriptions: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { addToast } = useToast();
  const { data: doctor } = useActiveDoctor();
  const { data: activeAppointment } = useActiveAppointment({
    patientId: parseInt(patientId, 10),
  });
  const {
    data: prescriptions,
    isLoading: isLoadingPrescriptions,
    refetch: refetchPrescriptions,
  } = trpc.prescription.getMany.useQuery(
    {
      appointmentId: activeAppointment?.id ?? 0,
    },
    { enabled: !!activeAppointment }
  );
  const {
    mutateAsync: deletePrescription,
    variables: deleteParameters,
    isLoading: isDeletingPrescription,
  } = trpc.prescription.delete.useMutation();
  const { data: patient } = trpc.patient.getById.useQuery({
    id: parseInt(patientId, 10),
  });
  const { data: printables } = trpc.doctor.printables.useQuery(
    {
      doctorId: doctor?.id ?? 0,
      type: printableTypes.prescription,
    },
    { enabled: !!doctor }
  );
  const [selectedPrintable, setSelectedPrintable] = useState<
    Printable | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrintButton = () => {
    if (printables && printables?.length > 0) {
      setIsOpen(true);
      return;
    }

    handlePrint();
  };

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
              onClick={handlePrintButton}
            >
              Imprimir
            </Button>
            <div className="hidden">
              <PrescriptionPrintable
                ref={printRef}
                doctor={doctor}
                prescriptions={prescriptions ?? []}
                patient={patient}
                printable={selectedPrintable}
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
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DescriptionList
          items={
            printables?.map((printable) => ({
              label: printable.name,
              buttonsOrLinks: [
                <Button
                  variant="link-primary"
                  iconLeft={PrinterIcon}
                  onClick={() => {
                    flushSync(() => {
                      setSelectedPrintable(printable);
                      setIsOpen(false);
                    });
                    handlePrint();
                  }}
                  key={0}
                >
                  Imprimir
                </Button>,
              ],
            })) ?? []
          }
        />
      </Modal>
    </>
  );
};

PatientPrescriptions.auth = 'block';
PatientPrescriptions.allowHigherOrEqualRole = 'DOCTOR';

export default PatientPrescriptions;
