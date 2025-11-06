import React from 'react';
import Page from '../../../components/Page';
import Product from '../../../features/Product';

export async function generateMetadata({ params }) {
  const { product } = params;
  
  return {
    title: 'Detalle del producto',
    description: 'Descubre los detalles de nuestros productos de nutrición personalizada para mascotas.',
    alternates: {
      canonical: `/productos/${product}`,
    },
  };
}

export default function ProductDetailPage() {
  return (
    <Page title="DNAture - Detalle">
      <Product />
    </Page>
  );
}
