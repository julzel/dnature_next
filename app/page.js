import React from 'react';
import Page from '../components/Page';
import Home from '../features/Home';
import { getCategories } from '../services/categories';
import JsonLd from '../components/JsonLd';
import { generateBreadcrumbSchema } from '../lib/seo';

export const metadata = {
  title: 'Inicio',
  description: 'DNAture - Nutrición personalizada para tu mascota basada en análisis de ADN. Alimento balanceado de alta calidad para perros en Costa Rica.',
  openGraph: {
    title: 'DNAture - Nutrición personalizada para tu mascota',
    description: 'Nutrición personalizada para tu mascota basada en análisis de ADN',
    images: [
      {
        url: '/images/hero3_wide.jpg',
        width: 1200,
        height: 630,
        alt: 'DNAture - Alimentación natural para mascotas',
      },
    ],
  },
  alternates: {
    canonical: '/',
  },
};

export const revalidate = 120; // Revalidate every 120 seconds

export default async function HomePage() {
  const categories = await getCategories();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />
      <Page>
        <Home categories={categories} />
      </Page>
    </>
  );
}
