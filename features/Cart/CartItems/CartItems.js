import React from 'react';

// local imports
// styles
import styles from './CartItems.module.scss';

// components
import CurrencyText from "../../../components/Currency";
import CartItemControllerContainer from "../CartItemController";

const CartItems = ({ items }) => {
  return (
    <div className={styles.cartItems}>
        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.cartItemInfo}>
              <h3>{item.productName}</h3>
              <p>
                <CurrencyText value={item.price * item.quantity} />{" "}
                <span className={styles.unds}>
                  (<CurrencyText value={item.price} /> c/u)
                </span>
              </p>
            </div>
            <div>
              <CartItemControllerContainer item={item} />
            </div>
          </div>
        ))}
      </div>
  );
};

export default CartItems;