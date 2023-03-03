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
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: productDetail.description }}
        />
      </div>
    )}
    {productDetail.ingredientes && (
      <div className={styles.productDetailIngredients}>
        <h2>Ingredientes</h2>
        <p className={styles.ingredients}>
          <br />
          {productDetail.ingredientes}
        </p>
        {productDetail.iconos && (
          <div className={styles.icons}>
            {productDetail.iconos.map((icono, j) => (
              <div key={j}>
                <Image
                  src={icono.url}
                  alt={icono.title}
                  width='100%'
                  height='100%'
                  layout='responsive'
                  objectFit='contain'
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
