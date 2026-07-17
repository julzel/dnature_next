import PlanDNA from '../../features/PlanDNA';

export const metadata = {
  title: 'Plan Nutricional DNAture',
  description:
    'Crea un plan nutricional personalizado para acompañar el bienestar de tu mascota.',
  alternates: { canonical: '/plan-dnature' },
};

const PlanDNAPage = () => <PlanDNA />;

export default PlanDNAPage;
