import { createPageMetadata } from '../../../constants/seo';
import PetsManager from '../../../features/AccountDemo/PetsManager';

export const metadata = createPageMetadata({
  title: 'Mis mascotas',
  description: 'Perfiles de mascotas en Mi DNAture.',
  path: '/cuenta/mascotas',
  robots: { index: false, follow: false },
});

const PetsPage = () => <PetsManager />;

export default PetsPage;
