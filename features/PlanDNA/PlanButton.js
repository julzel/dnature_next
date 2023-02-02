import React from 'react';

import styles from './PlanButton.module.scss';

const PlanButton = ({ text, onClick, variant = 'primary', disabled }) => {
  return (
    <button
      className={`${styles.planButton} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PlanButton;
