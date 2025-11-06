import React from 'react';
import Page from '../../components/Page';
import PlanDNA from '../../features/PlanDNA';

export const metadata = {
  title: 'Plan Nutricional',
  description: 'Descubre el Plan Nutricional DNAture. Nutrición personalizada basada en el análisis de ADN de tu mascota para una salud óptima.',
  alternates: {
    canonical: '/plan-dnature',
  },
};

export default function PlanDNAturePage() {
  return (
    <Page>
      <PlanDNA headTitle={'Plan Nutricional DNAture'} />
    </Page>
  );
}
