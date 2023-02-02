import React from 'react';

// local imports
// styles
import styles from './Button.module.scss';

const Button = ({ onClick, label, icon, disabled, variant = 'primary' }) => {
  const handleOnClick = () => onClick && onClick();

  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {icon && <span>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
