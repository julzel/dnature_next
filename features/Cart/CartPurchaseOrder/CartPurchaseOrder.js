import React from "react";

// local imports
// styles
import styles from "./CartPurchaseOrder.module.scss";

// components
import PurchaseOrderContainer from "../PurchaseOrder";
import Button from "../../../components/Button";

const CartPurchaseOrder = ({ onPurchaseCancel, onPurchaseConfirm }) => {
  return (
    <div className={styles.cartPurchaseOrder}>
      <PurchaseOrderContainer />
      <div className={styles.actions}>
        <Button
          className={`${styles.button} ${styles.secondary}`}
          onClick={onPurchaseCancel}
        >
          Cancelar
        </Button>
        <Button className={styles.button} onClick={onPurchaseConfirm}>
          Descargar Orden de Compra
        </Button>
      </div>
    </div>
  );
};

export default CartPurchaseOrder;
