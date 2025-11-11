// MessageBox.js
import React from 'react';
import Button from '../Button';

// local imports
// styles
import styles from './MessageBox.module.scss';

const MessageBox = ({ children, type, onClose, onCancel }) => {
  const intentByType = {
    error: 'danger',
    warning: 'warning',
    info: 'info',
    success: 'success',
  };

  const actionIntent = intentByType[type] || 'primary';

  return (
    <div className={`${styles.messageBoxContainer} ${styles[type]}`}>
      {children}
      <div className={styles.actions}>
        {onCancel && (
          <Button
            className={styles.button}
            intent="cancel"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        )}
        {onClose && (
          <Button
            className={styles.button}
            intent={actionIntent}
            onClick={onClose}
          >
            Ok
          </Button>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
