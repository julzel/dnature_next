import React from 'react';
import CartItems from './CartItems';

const CartItemsContainer = ({ items }) => {
  return (
    <CartItems items={items} />
  );
};

export default CartItemsContainer;