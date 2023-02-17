import React from 'react';

import styles from './ProductButton.module.scss';

const ProductButton = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button
      className={`${styles.heroButton} ${styles[variant]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ProductButton;
