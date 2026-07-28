import React from 'react';

import styles from './CartItems.module.scss';
import ContentfulImage from '../../../components/ContentfulImage';
import CurrencyText from '../../../components/Currency';
import CartItemControllerContainer from '../CartItemController';

const productPresentation = (item) => {
  if (item.presentation) {
    return item.presentation;
  }

  return (
    item.productName.match(/(\d+(?:[.,]\d+)?\s?(?:g|kg|ml|l))$/i)?.[1] ||
    'Producto natural'
  );
};

const CartItems = ({ items }) => (
  <ul className={styles.cartItems}>
    {items.map((item) => (
      <li key={item.id} className={styles.cartItem}>
        <div className={styles.productImage}>
          {item.image ? (
            <ContentfulImage
              src={item.image}
              alt=''
              width={140}
              height={140}
              sizes='(min-width: 768px) 112px, 82px'
            />
          ) : (
            <span aria-hidden='true'>DNA</span>
          )}
        </div>

        <div className={styles.cartItemInfo}>
          <h3>{item.productName}</h3>
          <p className={styles.presentation}>{productPresentation(item)}</p>
          <p className={styles.unitPrice}>
            <CurrencyText value={item.price} /> por unidad
          </p>
        </div>

        <div className={styles.lineTotal}>
          <span>Total</span>
          <strong>
            <CurrencyText value={item.price * item.quantity} />
          </strong>
        </div>

        <CartItemControllerContainer item={item} />
      </li>
    ))}
  </ul>
);

export default CartItems;
