import React from "react";
import { Trash2 } from "lucide-react";

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
        <button onClick={() => removeOneItem(item.id)}>
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
        <Trash2 size={18} />
      </span>
    </div>
  );
};

export default CartItemController;
