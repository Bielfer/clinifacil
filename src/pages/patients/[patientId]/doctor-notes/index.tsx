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
import DoctorNotePrintable from '@/components/features/printables/DoctorNotePrintable';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import { printableTypes } from '@/constants/printables';
import tryCatch from '@/helpers/tryCatch';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const DoctorNotes: Page = () => {
  const router = useRouter();
  const { addToast } = useToast();
  const patientId = router.query.patientId as string;
  const {
    data: doctorNotes,
    isLoading: isLoadingDoctorNotes,
    refetch: refetchDoctorNotes,
  } = trpc.doctorNote.getMany.useQuery(
    { patientId: parseInt(patientId, 10) },
    { enabled: !!patientId }
  );
  const { data: session } = useSession();
  const { data: doctor, isLoading: isLoadingDoctor } = trpc.doctor.get.useQuery(
    { userId: session?.user.id },
    { enabled: !!session }
  );
  const {
    mutateAsync: deleteDoctorNote,
    isLoading: isDeletingDoctorNote,
    variables: deleteParameters,
  } = trpc.doctorNote.delete.useMutation();
  const { data: printables } = trpc.doctor.printables.useQuery(
    {
      doctorId: doctor?.id ?? 0,
      type: printableTypes.doctorNote,
    },
    { enabled: !!doctor }
  );
  const printRef = useRef<HTMLDivElement>(null);

  const printableExists = (!!printables && printables.length > 0) || undefined;

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handleDeleteDoctorNote = async (doctorNoteId: number) => {
    const [, error] = await tryCatch(deleteDoctorNote({ id: doctorNoteId }));

    if (error)
      addToast({
        type: 'error',
        content: 'Falha ao remover remédio, tente novamente em 5 segundos!',
      });

    await refetchDoctorNotes();
  };

  return (
    <>
      <Head>
        <title>CliniFácil | Atestados do Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between">
          <Text h2>Atestados do Paciente</Text>
          <MyLink
            href={paths.newPatientDoctorNotes(patientId)}
            variant="button-primary"
            iconLeft={PlusIcon}
          >
            Novo Atestado
          </MyLink>
        </div>
        <TabsNavigation
          className="pt-2 pb-6"
          tabs={patientAppointmentPaths({ patientId })}
        />
        <LoadingWrapper loading={isLoadingDoctorNotes || isLoadingDoctor}>
          {doctorNotes && doctorNotes.length > 0 ? (
            <DescriptionList
              className="mx-auto max-w-2xl"
              items={
                doctorNotes?.map((doctorNote) => ({
                  label: `Atestado  de ${doctorNote.duration} dia(s)`,
                  buttonsOrLinks: [
                    <>
                      <Button
                        className="hidden sm:inline-flex"
                        variant="link-primary"
                        iconLeft={PrinterIcon}
                        size="sm"
                        onClick={handlePrint}
                      >
                        Imprimir
                      </Button>
                      <IconButton
                        icon={PrinterIcon}
                        variant="link-primary"
                        size="lg"
                        className="sm:hidden"
                        onClick={handlePrint}
                      />
                      <div className="hidden">
                        <DoctorNotePrintable
                          ref={printRef}
                          doctorNote={doctorNote}
                          doctor={doctor}
                          printable={printableExists && printables?.[0]}
                        />
                      </div>
                    </>,
                    <>
                      <Button
                        className="hidden sm:inline-flex"
                        variant="link-error"
                        iconLeft={TrashIcon}
                        size="sm"
                        loading={
                          isDeletingDoctorNote &&
                          deleteParameters?.id === doctorNote.id
                        }
                        onClick={() => handleDeleteDoctorNote(doctorNote.id)}
                      >
                        Apagar
                      </Button>
                      <IconButton
                        className="sm:hidden"
                        variant="link-error"
                        icon={TrashIcon}
                        size="lg"
                        loading={
                          isDeletingDoctorNote &&
                          deleteParameters?.id === doctorNote.id
                        }
                        onClick={() => handleDeleteDoctorNote(doctorNote.id)}
                      />
                    </>,
                  ],
                })) ?? []
              }
            />
          ) : (
            <EmptyState
              icon={ClipboardDocumentIcon}
              title="Nenhum atestado criado"
              subtitle="Para criar um novo atestado basta clicar no botão Novo Atestado"
            />
          )}
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

DoctorNotes.auth = 'block';
DoctorNotes.allowHigherOrEqualRole = 'DOCTOR';

export default DoctorNotes;
