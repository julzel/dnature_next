import React from 'react';
import Page from '../../components/Page';
import Products from '../../features/Products';
import { getProducts } from '../../services/products';
import JsonLd from '../../components/JsonLd';
import { generateBreadcrumbSchema } from '../../lib/seo';

export const metadata = {
  title: 'Nuestros productos',
  description: 'Descubre nuestra línea completa de alimentos balanceados para perros. Nutrición personalizada basada en ADN con ingredientes de alta calidad.',
  openGraph: {
    title: 'Productos DNAture - Nutrición natural para mascotas',
    description: 'Alimentos balanceados, snacks, suplementos y proteínas naturales para tu mascota',
    images: [
      {
        url: '/images/dnatureproducts.jpg',
        width: 1200,
        height: 630,
        alt: 'Productos DNAture',
      },
    ],
  },
  alternates: {
    canonical: '/productos',
  },
};

export const revalidate = 120; // Revalidate every 120 seconds

export default async function ProductosPage() {
  const products = await getProducts();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Productos', url: '/productos' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <Page title="DNAture - Nuestros productos">
        <Products products={products} />
      </Page>
    </>
  );
}
