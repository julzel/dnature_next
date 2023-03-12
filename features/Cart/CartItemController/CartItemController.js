import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

// local imports
// styles
import styles from "./CartItemController.module.scss";

const CartItemController = ({ addOneItem, removeOneItem, removeAllItemsOfAKind, item }) => {
  return (
    <div className={styles.cartItemController}>
    <span
      role="button"
      tabIndex={0}
      onClick={() => removeOneItem(item)}
    >
      -
    </span>
    {item.quantity}
    <span role="button" tabIndex={0} onClick={() => addOneItem(item)}>
      +
    </span>
    <span
      role="button"
      tabIndex={0}
      onClick={() => removeAllItemsOfAKind(item.id)}
    >
      <FontAwesomeIcon icon={faTrashCan} size="sm" />
    </span>
  </div>
  );
};

export default CartItemController;