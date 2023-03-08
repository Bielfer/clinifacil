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
import ImageExamModal from '@/components/features/exams/ImageExamModal';
import { examTypes } from '@/constants/exams';
import paths, {
  patientAppointmentPaths,
  sidebarPaths,
} from '@/constants/paths';
import tryCatch from '@/helpers/tryCatch';
import { useActiveAppointment } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { PlusIcon, TrashIcon } from '@heroicons/react/20/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientImageExams: Page = () => {
  const { addToast } = useToast();
  const patientId = useRouter().query.patientId as string;
  const { data: appointment } = useActiveAppointment({
    patientId: parseInt(patientId, 10),
  });
  const {
    data: exams,
    isLoading,
    refetch: refetchExams,
  } = trpc.exam.getMany.useQuery(
    { appointmentId: appointment?.id, type: examTypes.image },
    { enabled: !!appointment && !!patientId }
  );
  const {
    mutateAsync: deleteExam,
    variables: deleteParameters,
    isLoading: isDeletingExam,
  } = trpc.exam.delete.useMutation();

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
        <title>CliniFácil | Exames de Imagem</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between">
          <Text h2>Exames de Imagem</Text>
          <MyLink
            href={paths.newPatientImageExam(patientId)}
            variant="button-primary"
            iconLeft={PlusIcon}
          >
            Guardar Exame
          </MyLink>
        </div>
        <TabsNavigation
          className="pt-2 pb-6"
          tabs={patientAppointmentPaths({ patientId })}
        />
        <LoadingWrapper loading={isLoading}>
          {!!exams && exams.length > 0 ? (
            <DescriptionList
              title="Exames"
              className="mx-auto max-w-2xl pt-5"
              items={
                exams?.map((exam) => ({
                  label: exam.name,
                  buttonsOrLinks: [
                    <ImageExamModal imageUrl={exam.imageUrl ?? ''} key={1} />,
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
              icon={PhotoIcon}
              title="Nenhum exame armazenado"
              subtitle="Para guardar um novo exame de imagem basta clicar no botão Guardar Exame"
            />
          )}
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

PatientImageExams.auth = 'block';
PatientImageExams.allowHigherOrEqualRole = 'DOCTOR';

export default PatientImageExams;
