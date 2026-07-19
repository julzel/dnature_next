import React from 'react';

// local imports
// styles
import styles from './ProductItem.module.scss';
import GoBack from '../GoBack';
import ProductInfoContainer from '../ProductInfo';
import ProductDetail from '../ProductDetail';

const ProductItem = ({ productDetail }) => (
  <section className={styles.product}>
    <GoBack className={styles.backLink} />
    <ProductInfoContainer productDetail={productDetail} />
    <ProductDetail productDetail={productDetail} />
  </section>
);

export default ProductItem;
