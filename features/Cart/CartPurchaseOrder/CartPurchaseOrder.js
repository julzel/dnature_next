import React from 'react';

// local imports
// styles
import styles from './CartPurchaseOrder.module.scss';

// components
import PurchaseOrderContainer from '../PurchaseOrder';

const CartPurchaseOrder = () => {
  return (
    <div className={styles.cartPurchaseOrder}>
      <div className={styles.modal}>
        <PurchaseOrderContainer />
      </div>
  </div>
  );
};

export default CartPurchaseOrder;