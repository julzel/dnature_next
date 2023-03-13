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
        <button onClick={() => removeOneItem(item)}>
          -
        </button>
        {item.quantity}
        <button onClick={() => addOneItem(item)}>
          +
        </button>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={() => removeAllItemsOfAKind(item.id)}
        className={styles.delete}
      >
        <FontAwesomeIcon icon={faTrashCan} size="sm" />
      </span>
    </div>
  );
};

export default CartItemController;
