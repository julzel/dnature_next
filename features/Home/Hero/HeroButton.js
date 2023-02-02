import React from 'react';

import styles from './HeroButton.module.scss';

const HeroButton = ({ text, onClick, variant = 'primary' }) => {
  return (
    <button
      className={`${styles.heroButton} ${styles[variant]}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default HeroButton;
