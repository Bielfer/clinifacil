import Button from '@/components/core/Button';
import DescriptionList from '@/components/core/DescriptionList';
import EmptyState from '@/components/core/EmptyState';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PlusIcon, PrinterIcon, TrashIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';

const DoctorNotes: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const {
    data: doctorNotes,
    isLoading: isLoadingDoctorNotes,
    refetch: refetchDoctorNotes,
  } = trpc.doctorNote.getMany.useQuery(
    { patientId: parseInt(patientId, 10) },
    { enabled: !!patientId }
  );
  const { mutateAsync: deleteDoctorNote, isLoading: isDeletingDoctorNote } =
    trpc.doctorNote.delete.useMutation();

  const handleDeleteDoctorNote = async (doctorNoteId: number) => {
    await deleteDoctorNote({ id: doctorNoteId });
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
        <LoadingWrapper loading={isLoadingDoctorNotes}>
          {doctorNotes && doctorNotes.length > 0 ? (
            <DescriptionList
              className="mx-auto max-w-2xl"
              items={
                doctorNotes?.map(({ id, duration }) => ({
                  label: `Atestado  de ${duration} dia(s)`,
                  buttonsOrLinks: [
                    <Button
                      key={1}
                      variant="link-primary"
                      iconLeft={PrinterIcon}
                      size="sm"
                      onClick={() => console.log('print')}
                    >
                      Imprimir
                    </Button>,
                    <Button
                      key={2}
                      variant="link-error"
                      iconLeft={TrashIcon}
                      size="sm"
                      loading={isDeletingDoctorNote}
                      onClick={() => handleDeleteDoctorNote(id)}
                    >
                      Apagar
                    </Button>,
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
