import React from 'react';
import Page from '../../components/Page';
import Faq from '../../features/Faq';

export const metadata = {
  title: 'Preguntas frecuentes',
  description: 'Encuentra respuestas a las preguntas más comunes sobre DNAture, nuestros productos y servicios de nutrición personalizada para mascotas.',
  alternates: {
    canonical: '/preguntas-frecuentes',
  },
};

export default function PreguntasFrecuentesPage() {
  return (
    <Page title="DNAture - Preguntas frecuentes">
      <Faq />
    </Page>
  );
}
