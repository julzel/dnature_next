import { createPageMetadata } from '../../../constants/seo';
import { Dashboard } from '../../../features/Account';

export const metadata = createPageMetadata({
  title: 'Mi cuenta',
  description: 'Panel personal de clientes de DNAture.',
  path: '/cuenta',
  robots: { index: false, follow: false },
});

const AccountPage = () => <Dashboard />;

export default AccountPage;

