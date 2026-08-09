import { createPageMetadata } from '../../../constants/seo';
import SavedCarts from '../../../features/AccountDemo/SavedCarts';

export const metadata = createPageMetadata({
  title: 'Mis carritos',
  description: 'Carritos frecuentes guardados en Mi DNAture.',
  path: '/cuenta/carritos',
  robots: { index: false, follow: false },
});

const SavedCartsPage = () => <SavedCarts />;

export default SavedCartsPage;
