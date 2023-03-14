import React from "react";

// local imports
// styles
import styles from "./CartActions.module.scss";

// components
import Button from "../../../components/Button";

const CartActions = ({ router, proceedToPurchase }) => {
  return (
    <div className={styles.cartActions}>
      <Button
        className={`${styles.button} ${styles.secondary}`}
        onClick={() => console.log("generar orden")}
      >
        Vaciar Carrito
      </Button>
      <Button className={`${styles.button} ${styles.variant}`} onClick={() => router.back()}>
        Regresar
      </Button>
      <Button className={styles.button} onClick={() => proceedToPurchase()}>
        Continuar
      </Button>
    </div>
  );
};

export default CartActions;
