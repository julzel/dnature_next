import React from 'react';

// local imports
import Page from '../../../components/Page';

//
import Product from '../../../features/Product';
import { ShoppingCartContextProvider } from '../../../contexts/shopping-cart-context';

const ProductDetail = () => {
  return (
    <Page>
      <Product />
    </Page>
  );
};

export default ProductDetail;
