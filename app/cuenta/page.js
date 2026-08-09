import { createPageMetadata } from '../../constants/seo';
import Dashboard from '../../features/AccountDemo/Dashboard';

export const metadata = createPageMetadata({
  title: 'Mi cuenta',
  description: 'Panel personal de clientes de DNAture.',
  path: '/cuenta',
  robots: { index: false, follow: false },
});

const AccountPage = () => <Dashboard />;

export default AccountPage;
