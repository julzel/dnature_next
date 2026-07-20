import React from "react";

// local imports
// styles
import styles from "./CartActions.module.scss";

// components
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import MessageBoxContainer from "../../../components/MessageBox";

const CartActions = ({
  onBack,
  totalItems,
  proceedToPurchase,
  handleRemoveAllItems,
  displayRemoveAllModal,
  toggleRemoveAllModal,
}) => {
  return (
    <div className={styles.cartActions}>
      {totalItems > 0 && (
        <Button
          className={styles.button}
          variant="danger"
          onClick={toggleRemoveAllModal}
        >
          Vaciar Carrito
        </Button>
      )}
      <Button
        className={styles.button}
        variant="tertiary"
        onClick={onBack}
      >
        Regresar
      </Button>
      {totalItems > 0 && (
        <Button className={styles.button} variant="primary" onClick={() => proceedToPurchase()}>
          Continuar
        </Button>
      )}
      {displayRemoveAllModal && (
        <Modal
          ariaLabel="Confirmar vaciado del carrito"
          closeModal={toggleRemoveAllModal}
        >
          <MessageBoxContainer
            type={"warning"}
            onClose={handleRemoveAllItems}
            onCancel={toggleRemoveAllModal}
          >
            <h3>¡Atención!</h3>
            <p>Esta opción eliminará todos los items que has seleccionado.</p>
            <p>¿Estás seguro de querer vaciar el carrito?</p>
          </MessageBoxContainer>
        </Modal>
      )}
    </div>
  );
};

export default CartActions;
