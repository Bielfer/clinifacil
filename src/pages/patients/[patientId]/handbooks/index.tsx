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
import { useActiveAppointment } from '@/hooks';
import { Page } from '@/types/auth';
import { PencilIcon, PlusIcon } from '@heroicons/react/20/solid';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientHandbook: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: activeAppointment, isLoading: isLoadingAppointment } =
    useActiveAppointment({ patientId: parseInt(patientId, 10) });

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
                  activeAppointment?.handbooks.map((handbook) => ({
                    label: handbook.title,
                    buttonsOrLinks: [
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
                  })) ?? []
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
