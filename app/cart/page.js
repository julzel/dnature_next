import React from 'react';
import Page from '../../components/Page';
import Cart from '../../features/Cart';

export const metadata = {
  title: 'Carrito de Compras - DNAture',
  description: 'Carrito de compras DNAture',
};

export default function CartPage() {
  return (
    <Page>
      <Cart headTitle={'Carrito de Compras'} />
    </Page>
  );
}
