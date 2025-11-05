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
          {productDetail.ingredientes}
        </p>
        {productDetail.iconos && (
          <div className={styles.icons}>
            {productDetail.iconos.map((icono, j) => (
              <div key={j}>
                <Image
                  src={icono.url}
                  alt={icono.title}
                  width={500} // Updated to numeric value
                  height={500} // Updated to numeric value
                  style={{ objectFit: 'contain' }} // Replaced legacy layout prop
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
