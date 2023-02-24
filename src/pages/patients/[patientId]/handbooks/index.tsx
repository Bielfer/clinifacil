import Button from '@/components/core/Button';
import DescriptionList from '@/components/core/DescriptionList';
import EmptyState from '@/components/core/EmptyState';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import HandbookPrintable from '@/components/features/printables/HandbookPrintable';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import { useActiveAppointment, useActiveDoctor } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PencilIcon, PlusIcon, PrinterIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PatientHandbook: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: activeAppointment, isLoading: isLoadingAppointment } =
    useActiveAppointment({ patientId: parseInt(patientId, 10) });
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  const { data: doctor } = useActiveDoctor();
  const { data: patient } = trpc.patient.get.useQuery(
    { id: parseInt(patientId, 10) },
    { enabled: !!patientId }
  );
  const { data: printables } = trpc.doctor.printables.useQuery(
    {
      doctorId: doctor?.id ?? 0,
      type: 'GLASSES_PRESCRIPTION',
    },
    { enabled: !!doctor }
  );

  const printableExists = (!!printables && printables.length > 0) || undefined;

  return (
    <>
      <Head>
        <title>CliniFácil | Prontuário do Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between">
          <Text h2>Prontuário do Paciente</Text>
          <MyLink
            href={paths.newPatientHandbook(patientId)}
            variant="button-primary"
            iconLeft={PlusIcon}
          >
            Nova Consulta
          </MyLink>
        </div>
        <TabsNavigation
          className="pt-2 pb-6"
          tabs={patientAppointmentPaths({ patientId })}
        />
        <LoadingWrapper loading={isLoadingAppointment}>
          <div className="mx-auto max-w-2xl">
            {!!activeAppointment && activeAppointment.handbooks.length > 0 ? (
              <DescriptionList
                items={
                  activeAppointment?.handbooks.map((handbook) => {
                    const shouldPrint = handbook.fields.some(
                      (field) => field.print
                    );

                    return {
                      label: handbook.title,
                      buttonsOrLinks: [
                        shouldPrint && (
                          <>
                            <Button
                              variant="link-primary"
                              iconLeft={PrinterIcon}
                              onClick={handlePrint}
                            >
                              Imprimir
                            </Button>
                            <div className="hidden">
                              <HandbookPrintable
                                handbook={handbook}
                                ref={printRef}
                                patient={patient}
                                doctor={doctor}
                                printable={printableExists && printables?.[0]}
                              />
                            </div>
                          </>
                        ),
                        <MyLink
                          key={handbook.id}
                          variant="primary"
                          iconLeft={PencilIcon}
                          href={paths.patientHandbookById({
                            patientId,
                            handbookId: handbook.id,
                          })}
                        >
                          Alterar
                        </MyLink>,
                      ],
                    };
                  }) ?? []
                }
              />
            ) : (
              <EmptyState
                icon={ClipboardDocumentListIcon}
                title="Nenhuma consulta criada"
                subtitle="Para criar uma nova consulta basta clicar no botão Nova Consulta acima!"
              />
            )}
          </div>
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

PatientHandbook.auth = 'block';
PatientHandbook.allowHigherOrEqualRole = 'DOCTOR';

export default PatientHandbook;
