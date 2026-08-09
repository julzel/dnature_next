import { createPageMetadata } from '../../../constants/seo';
import ProfileSettings from '../../../features/AccountDemo/ProfileSettings';

export const metadata = createPageMetadata({
  title: 'Mi perfil',
  description: 'Datos y preferencias de la cuenta de cliente DNAture.',
  path: '/cuenta/perfil',
  robots: { index: false, follow: false },
});

const ProfilePage = () => <ProfileSettings />;

export default ProfilePage;
