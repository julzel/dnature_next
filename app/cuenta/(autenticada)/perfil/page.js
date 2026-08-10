import { createPageMetadata } from '../../../../constants/seo';
import { ProfileSettings } from '../../../../features/Account';

export const metadata = createPageMetadata({
  title: 'Mi perfil',
  description: 'Datos de la cuenta de cliente DNAture.',
  path: '/cuenta/perfil',
  robots: { index: false, follow: false },
});

const ProfilePage = () => <ProfileSettings />;

export default ProfilePage;

