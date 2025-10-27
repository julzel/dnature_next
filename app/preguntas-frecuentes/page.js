import React from 'react';
import Page from '../../components/Page';
import Faq from '../../features/Faq';

export const metadata = {
  title: 'DNAture - Preguntas frecuentes',
  description: 'Preguntas frecuentes DNAture',
};

export default function PreguntasFrecuentesPage() {
  return (
    <Page title="DNAture - Preguntas frecuentes">
      <Faq />
    </Page>
  );
}
