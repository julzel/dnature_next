import React from 'react';

// local imports
// styles
import styles from './ProductItem.module.scss';
import GoBack from '../GoBack';
import ProductInfo from '../ProductInfo';
import ProductDetail from '../ProductDetail';

const ProductItem = ({ productDetail }) => (
  <section className={styles.product}>
    <GoBack className={styles.backLink} />
    <ProductInfo productDetail={productDetail} />
    <ProductDetail productDetail={productDetail} />
  </section>
);

export default ProductItem;
