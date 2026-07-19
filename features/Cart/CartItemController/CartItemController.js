import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./CartItemController.module.scss";

const CartItemController = ({
  addOneItem,
  removeOneItem,
  removeAllItemsOfAKind,
  item,
}) => {
  return (
    <div className={styles.cartItemController}>
      <div className={styles.badge}>
        <button type="button" aria-label={`Restar una unidad de ${item.productName}`} onClick={() => removeOneItem(item.id)}>
          -
        </button>
        {item.quantity}
        <button type="button" aria-label={`Agregar una unidad de ${item.productName}`} onClick={() => addOneItem(item)}>
          +
        </button>
      </div>
      <button
        type="button"
        aria-label={`Eliminar ${item.productName} del carrito`}
        onClick={() => removeAllItemsOfAKind(item.id)}
        className={styles.delete}
      >
        <FontAwesomeIcon icon={faTrashCan} size="sm" />
      </button>
    </div>
  );
};

export default CartItemController;
