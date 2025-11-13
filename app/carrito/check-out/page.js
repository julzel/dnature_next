import React from 'react';
import Page from '../../../components/Page';
import CheckoutFlow from '../../../components/Checkout/CheckoutFlow';

export const metadata = {
  title: 'Checkout - DNAture',
  description:
    'Completa tu información de cliente, envío y confirma tu orden de compra.',
};

const CartCheckoutPage = () => {
  return (
    <Page>
      <CheckoutFlow />
    </Page>
  );
};

export default CartCheckoutPage;
