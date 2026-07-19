import React from 'react';

import styles from './ProductButton.module.scss';

const ProductButton = ({ text, variant = 'primary' }) => {
  return (
    <span className={`${styles.heroButton} ${styles[variant]}`}>
      {text}
    </span>
  );
};

export default ProductButton;
