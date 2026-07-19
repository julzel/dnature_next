import React from 'react';
import Image from 'next/image';

// local imports
// styles
import styles from './ProductDetail.module.scss';

const ProductDetail = ({ productDetail }) => (
  <div className={styles.productDetail}>
    {productDetail.description && (
      <div>
        <h2>Información</h2>
        <div className={styles.description} style={{ whiteSpace: 'pre-line' }}>
          {productDetail.description}
        </div>
      </div>
    )}
    {productDetail.ingredientes && (
      <div className={styles.productDetailIngredients}>
        <h2>Ingredientes</h2>
        <p className={styles.ingredients}>
          {productDetail.ingredientes}
        </p>
        {productDetail.iconos && (
          <div className={styles.icons}>
            {productDetail.iconos.map((icono, j) => (
              <div className={styles.icon} key={j}>
                <Image
                  src={icono.url}
                  alt={icono.title}
                  width={48}
                  height={48}
                  sizes='48px'
                  className={styles.iconImage}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </div>
);

export default ProductDetail;
