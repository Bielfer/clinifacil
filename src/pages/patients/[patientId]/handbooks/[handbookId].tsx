import LoadingWrapper from '@/components/core/LoadingWrapper';
import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import FormHandbook from '@/components/forms/FormHandbook';
import { sidebarPaths } from '@/constants/paths';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientHandbookById: Page = () => {
  const router = useRouter();
  const handbookId = router.query.handbookId as string;
  const { data: handbook, isFetchedAfterMount } = trpc.handbook.get.useQuery(
    {
      id: parseInt(handbookId, 10),
    },
    { enabled: !!handbookId }
  );

  return (
    <>
      <Head>
        <title>CliniFácil | Altere a Consulta</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="mx-auto max-w-2xl">
          <Text h2 className="pb-6">
            Altere a consulta
          </Text>
          <LoadingWrapper loading={!isFetchedAfterMount}>
            <FormHandbook handbook={handbook} />
          </LoadingWrapper>
        </div>
      </Sidebar>
    </>
  );
};

export default PatientHandbookById;
