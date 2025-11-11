import React from 'react';
import Page from '../../components/Page';
import PlanDNA from '../../features/PlanDNA';
import JsonLd from '../../components/JsonLd';
import { generateBreadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Plan Nutricional',
  description:
    'Descubre el Plan Nutricional DNAture. Nutrición personalizada basada en el análisis de ADN de tu mascota para una salud óptima.',
  openGraph: {
    title: 'Plan Nutricional DNAture',
    description:
      'Nutrición personalizada basada en el análisis de ADN de tu mascota',
    images: [
      {
        url: '/images/plandna-desk.jpg',
        width: 1200,
        height: 630,
        alt: 'Plan Nutricional DNAture',
      },
    ],
  },
  alternates: {
    canonical: '/plan-dnature',
  },
};

export default function PlanDNAturePage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Plan Nutricional', url: '/plan-dnature' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Page>
        <PlanDNA headTitle={'Plan Nutricional DNAture'} />
      </Page>
    </>
  );
}
