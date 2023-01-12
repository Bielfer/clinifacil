import LinksList from '@/components/core/LinksList';
import LinksListSkeleton from '@/components/core/LinksList/LinksListSkeleton';
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
import { PlusIcon } from '@heroicons/react/20/solid';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientHandbook: Page = () => {
  const router = useRouter();
  const patientId = router.query.patientId as string;
  const { data: session } = useSession();
  const { data: doctor } = trpc.doctor.get.useQuery({
    userId: session?.user.id,
  });
  const { data: appointments } = trpc.appointment.getMany.useQuery(
    {
      patientId: parseInt(patientId, 10),
      doctorId: doctor?.id,
    },
    { enabled: !!doctor?.id }
  );
  const activeAppointment = appointments?.[0];

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
        <div className="mx-auto max-w-2xl">
          {activeAppointment ? (
            <LinksList>
              {activeAppointment.handbooks.map((handbook) => (
                <LinksList.Item
                  key={handbook.id}
                  href={paths.patientHandbookById({
                    patientId,
                    handbookId: handbook.id,
                  })}
                >
                  {handbook.title}
                </LinksList.Item>
              ))}
            </LinksList>
          ) : (
            <LinksListSkeleton rows={5} />
          )}
        </div>
      </Sidebar>
    </>
  );
};

PatientHandbook.auth = 'block';
PatientHandbook.allowHigherOrEqualRole = 'DOCTOR';

export default PatientHandbook;
