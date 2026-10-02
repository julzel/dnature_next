import React from 'react';

// local imports

import GoBack from '../GoBack';
import ProductInfoContainer from '../ProductInfo';
import ProductDetail from '../ProductDetail';

const ProductItem = ({ productDetail }) => (
  <section className='product-page store-shell'>
    <GoBack productDetail={productDetail} />
    <ProductInfoContainer productDetail={productDetail} />
    <ProductDetail productDetail={productDetail} />
  </section>
);

export default ProductItem;
