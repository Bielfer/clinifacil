import Sidebar from '@/components/core/Sidebar';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import { Page } from '@/types/auth';
import Head from 'next/head';
import Text from '@/components/core/Text';
import Button from '@/components/core/Button';
import TabsNavigation from '@/components/core/TabsNavigation';
import { useRouter } from 'next/router';
import { PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/20/solid';
import MyLink from '@/components/core/MyLink';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ExamPrintable from '@/components/features/printables/ExamPrintable';
import { trpc } from '@/services/trpc';
import { useActiveDoctor } from '@/hooks';
import { printableTypes } from '@/constants/printables';
import DescriptionList from '@/components/core/DescriptionList';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import IconButton from '@/components/core/IconButton';
import EmptyState from '@/components/core/EmptyState';
import { BeakerIcon } from '@heroicons/react/24/outline';
import tryCatch from '@/helpers/tryCatch';
import { useToast } from '@/components/core/Toast';

const PatientExams: Page = () => {
  const patientId = useRouter().query.patientId as string;
  const { addToast } = useToast();
  const { data: doctor } = useActiveDoctor();
  const { data: activeAppointment } = trpc.appointment.active.useQuery(
    {
      patientId: parseInt(patientId, 10),
      doctorId: doctor?.id ?? 0,
    },
    { enabled: !!doctor && !!patientId }
  );
  const {
    data: exams,
    isLoading: isLoadingExams,
    refetch: refetchExams,
  } = trpc.exam.getMany.useQuery(
    {
      appointmentId: activeAppointment?.id,
    },
    { enabled: !!activeAppointment }
  );
  const {
    mutateAsync: deleteExam,
    variables: deleteParameters,
    isLoading: isDeletingExam,
  } = trpc.exam.delete.useMutation();
  const { data: patient } = trpc.patient.getById.useQuery({
    id: parseInt(patientId, 10),
  });
  const { data: printables } = trpc.doctor.printables.useQuery(
    {
      doctorId: doctor?.id ?? 0,
      type: printableTypes.exams,
    },
    { enabled: !!doctor }
  );
  const printRef = useRef<HTMLDivElement>(null);

  const printableExists = (!!printables && printables.length > 0) || undefined;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDeleteExam = async (examId: number) => {
    const [, error] = await tryCatch(deleteExam({ id: examId }));

    if (error)
      addToast({
        type: 'error',
        content: 'Falha ao remover remédio, tente novamente em 5 segundos!',
      });

    await refetchExams();
  };

  return (
    <>
      <Head>
        <title>CliniFácil | Solicitação de Exames</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between">
          <Text h2>Exames do Paciente</Text>
          <div className="flex flex-col-reverse items-end gap-y-2 pl-3 sm:flex-row sm:items-center sm:gap-y-0 sm:gap-x-3">
            <Button
              iconLeft={PrinterIcon}
              variant="secondary"
              onClick={handlePrint}
            >
              Imprimir
            </Button>
            <div className="hidden">
              <ExamPrintable
                ref={printRef}
                doctor={doctor}
                exams={exams ?? []}
                patient={patient}
                printable={printableExists && printables?.[0]}
              />
            </div>
            <MyLink
              href={paths.newPatientExam(patientId)}
              iconLeft={PlusIcon}
              variant="button-primary"
            >
              Novo Exame
            </MyLink>
          </div>
        </div>
        <TabsNavigation
          className="pt-2 pb-6"
          tabs={patientAppointmentPaths({ patientId })}
        />
        <LoadingWrapper loading={isLoadingExams}>
          {!!exams && exams.length > 0 ? (
            <DescriptionList
              title="Remédios"
              className="mx-auto max-w-2xl pt-5"
              items={
                exams?.map((exam) => ({
                  label: exam.name,
                  buttonsOrLinks: [
                    <>
                      <Button
                        className="hidden sm:inline-flex"
                        variant="link-error"
                        iconLeft={TrashIcon}
                        size="sm"
                        loading={
                          isDeletingExam && deleteParameters?.id === exam.id
                        }
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        Apagar
                      </Button>
                      <IconButton
                        className="sm:hidden"
                        variant="link-error"
                        icon={TrashIcon}
                        size="lg"
                        loading={
                          isDeletingExam && deleteParameters?.id === exam.id
                        }
                        onClick={() => handleDeleteExam(exam.id)}
                      />
                    </>,
                  ],
                })) ?? []
              }
            />
          ) : (
            <EmptyState
              icon={BeakerIcon}
              title="Nenhum exame solicitado"
              subtitle="Para solicitar um novo exame basta clicar no botão Novo Exame"
            />
          )}
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};
export default PatientExams;
