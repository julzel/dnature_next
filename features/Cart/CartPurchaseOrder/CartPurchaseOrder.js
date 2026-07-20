import React from "react";

// local imports
// styles
import styles from "./CartPurchaseOrder.module.scss";

// components
import PurchaseOrderContainer from "../PurchaseOrder";
import Button from "../../../components/Button";

const CartPurchaseOrder = ({ onPurchaseCancel, onPurchaseConfirm, purchaseError, isCapturingPurchase }) => {
  return (
    <div className={styles.cartPurchaseOrder}>
      <PurchaseOrderContainer />
      <div className={styles.actions}>
        <Button
          className={styles.button}
          variant="secondary"
          onClick={onPurchaseCancel}
          disabled={isCapturingPurchase}
        >
          Cancelar
        </Button>
        <Button className={styles.button} variant="primary" onClick={onPurchaseConfirm} disabled={isCapturingPurchase} loading={isCapturingPurchase}>
          {isCapturingPurchase ? 'Generando…' : 'Confirmar'}
        </Button>
      </div>
      {purchaseError && <p role="alert">{purchaseError}</p>}
    </div>
  );
};

export default CartPurchaseOrder;
