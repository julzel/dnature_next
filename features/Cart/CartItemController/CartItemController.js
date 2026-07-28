import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

import styles from './CartItemController.module.scss';

const CartItemController = ({
  addOneItem,
  removeOneItem,
  removeAllItemsOfAKind,
  item,
}) => (
  <div className={styles.cartItemController}>
    <div
      className={styles.badge}
      aria-label={`Cantidad de ${item.productName}: ${item.quantity}`}
    >
      <button
        type='button'
        aria-label={`Restar una unidad de ${item.productName}`}
        onClick={() => removeOneItem(item.id)}
      >
        <Minus aria-hidden='true' size={16} strokeWidth={2.2} />
      </button>
      <output aria-live='polite'>{item.quantity}</output>
      <button
        type='button'
        aria-label={`Agregar una unidad de ${item.productName}`}
        onClick={() => addOneItem(item)}
      >
        <Plus aria-hidden='true' size={16} strokeWidth={2.2} />
      </button>
    </div>
    <button
      type='button'
      aria-label={`Eliminar ${item.productName} del carrito`}
      onClick={() => removeAllItemsOfAKind(item.id)}
      className={styles.delete}
    >
      <Trash2 aria-hidden='true' size={17} strokeWidth={1.9} />
    </button>
  </div>
);

export default CartItemController;
