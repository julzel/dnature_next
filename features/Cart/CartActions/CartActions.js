import React from 'react';

import styles from './CartActions.module.scss';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import MessageBoxContainer from '../../../components/MessageBox';

const CartActions = ({
  onBack,
  totalItems,
  proceedToPurchase,
  handleRemoveAllItems,
  displayRemoveAllModal,
  toggleRemoveAllModal,
}) => (
  <div className={styles.cartActions}>
    {totalItems > 0 && (
      <Button
        className={styles.continueButton}
        variant='primary'
        size='large'
        fullWidth
        onClick={proceedToPurchase}
      >
        Continuar
      </Button>
    )}

    <div className={styles.secondaryActions}>
      <Button variant='tertiary' onClick={onBack}>
        Regresar
      </Button>
      {totalItems > 0 && (
        <Button
          className={styles.emptyButton}
          variant='tertiary'
          onClick={toggleRemoveAllModal}
        >
          Vaciar carrito
        </Button>
      )}
    </div>

    {displayRemoveAllModal && (
      <Modal
        ariaLabel='Confirmar vaciado del carrito'
        closeModal={toggleRemoveAllModal}
      >
        <MessageBoxContainer
          type='warning'
          onClose={handleRemoveAllItems}
          onCancel={toggleRemoveAllModal}
        >
          <h3>¡Atención!</h3>
          <p>Esta opción eliminará todos los productos que seleccionaste.</p>
          <p>¿Estás seguro de querer vaciar el carrito?</p>
        </MessageBoxContainer>
      </Modal>
    )}
  </div>
);

export default CartActions;
