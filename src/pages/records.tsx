import Sidebar from '@/components/core/Sidebar';
import Text from '@/components/core/Text';
import { Page } from '@/types/auth';

const Records: Page = () => (
  <Sidebar className="p-6">
    <Text h2>Prontuário</Text>
  </Sidebar>
);

Records.auth = 'block';

export default Records;
