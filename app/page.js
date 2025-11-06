import React from 'react';
import Page from '../components/Page';
import Home from '../features/Home';
import { getCategories } from '../services/categories';

export const metadata = {
  title: 'Inicio',
  description: 'DNature - Nutrición fisiológicapersonalizada para tu mascota basada en análisis de ADN. Alimento balanceado de alta calidad para perros en Costa Rica.',
  alternates: {
    canonical: '/',
  },
};

export const revalidate = 120; // Revalidate every 120 seconds

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <Page>
      <Home categories={categories} />
    </Page>
  );
}
