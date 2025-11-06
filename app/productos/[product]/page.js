import React from 'react';
import Page from '../../../components/Page';
import Product from '../../../features/Product';

export const metadata = {
  title: 'DNAture - Detalle',
  description: 'Detalle del producto DNAture',
};

export default function ProductDetailPage() {
  return (
    <Page title="DNAture - Detalle">
      <Product />
    </Page>
  );
}
