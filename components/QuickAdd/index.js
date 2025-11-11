import React from 'react';
import { MinusCircle, PlusCircle } from 'lucide-react';

import styles from './QuickAdd.module.scss';

const QuickAdd = ({ itemsInCart, removeOneItemFromCart, addItemToCart }) => {
  return (
    <div className={styles.quickAdd}>
      <button
        disabled={itemsInCart === 0}
        className={styles.light}
        onClick={removeOneItemFromCart}
      >
        <MinusCircle size={20} />
      </button>
      <span className={styles.badge}>{itemsInCart || 0}</span>
      <button onClick={addItemToCart}>
        <PlusCircle size={20} />
      </button>
    </div>
  );
};

export default QuickAdd;
