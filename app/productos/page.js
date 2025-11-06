import React from 'react';
import Page from '../../components/Page';
import Products from '../../features/Products';
import { getProducts } from '../../services/products';

export const metadata = {
  title: 'Nuestros productos',
  description: 'Descubre nuestra línea completa de alimentos balanceados para perros y gatos. Nutrición personalizada basada en el ADN de tu mascota con ingredientes de alta calidad.',
  alternates: {
    canonical: '/productos',
  },
};

export const revalidate = 120; // Revalidate every 120 seconds

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <Page title="DNAture - Nuestros productos">
      <Products products={products} />
    </Page>
  );
}
