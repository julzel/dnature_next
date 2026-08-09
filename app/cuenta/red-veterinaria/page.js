import { createPageMetadata } from '../../../constants/seo';
import PartnerNetwork from '../../../features/AccountDemo/PartnerNetwork';

export const metadata = createPageMetadata({
  title: 'Red Veterinaria',
  description: 'Directorio de aliados para clientes de DNAture.',
  path: '/cuenta/red-veterinaria',
  robots: { index: false, follow: false },
});

const PartnerNetworkPage = () => <PartnerNetwork />;

export default PartnerNetworkPage;
