import PlanDNA from '../../features/PlanDNA';
import { createPageMetadata } from '../../constants/seo';

export const metadata = createPageMetadata({
  title: 'Plan Nutricional DNAture',
  description:
    'Crea un plan nutricional personalizado para acompañar el bienestar de tu mascota.',
  path: '/plan-dnature',
});

const PlanDNAPage = () => <PlanDNA />;

export default PlanDNAPage;
