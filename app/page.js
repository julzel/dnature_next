import React from 'react';
import Page from '../components/Page';
import Home from '../features/Home';
import { getCategories } from '../services/categories';

export const revalidate = 120; // Revalidate every 120 seconds

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <Page>
      <Home categories={categories} />
    </Page>
  );
}
