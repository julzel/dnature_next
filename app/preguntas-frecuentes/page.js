import React from 'react';
import Page from '../../components/Page';
import Faq from '../../features/Faq';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../lib/seo';
import FAQ from '../../features/Faq/FaqList/data';

export const metadata = {
  title: 'Preguntas frecuentes',
  description: 'Encuentra respuestas a las preguntas más comunes sobre DNAture, nuestros productos y servicios de nutrición personalizada para mascotas.',
  openGraph: {
    title: 'Preguntas frecuentes | DNAture',
    description: 'Respuestas a tus dudas sobre nutrición natural para mascotas',
    images: [
      {
        url: '/images/hero3_wide.jpg',
        width: 1200,
        height: 630,
        alt: 'Preguntas frecuentes DNAture',
      },
    ],
  },
  alternates: {
    canonical: '/preguntas-frecuentes',
  },
};

export default function PreguntasFrecuentesPage() {
  // Format FAQs for schema - strip HTML from answers
  const faqsForSchema = FAQ.map(faq => ({
    question: faq.question,
    answer: faq.answer.replace(/<[^>]*>/g, '').trim(),
  }));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Preguntas frecuentes', url: '/preguntas-frecuentes' },
  ]);

  const faqSchema = generateFAQSchema(faqsForSchema);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
        suppressHydrationWarning
      />
      <Page title="DNAture - Preguntas frecuentes">
        <Faq />
      </Page>
    </>
  );
}
