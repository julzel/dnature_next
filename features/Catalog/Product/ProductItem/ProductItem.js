import React from 'react';

// local imports

import GoBack from '../GoBack';
import ProductInfoContainer from '../ProductInfo';
import ProductDetail from '../ProductDetail';

const ProductItem = ({ productDetail }) => (
  <section>
    <GoBack productDetail={productDetail} />
    <ProductInfoContainer productDetail={productDetail} />
    <ProductDetail productDetail={productDetail} />
  </section>
);

export default ProductItem;
