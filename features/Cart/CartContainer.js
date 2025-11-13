'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// local imports
// components
import Cart from './Cart';

// contexts
import { useCartContext } from '../../contexts/shopping-cart-context';

const CartContainer = () => {
  const router = useRouter();
  const { cart } = useCartContext();

  const proceedToPurchase = () => {
    router.push('/carrito/check-out');
  };

  return <Cart cart={cart} proceedToPurchase={proceedToPurchase} />;
};

export default CartContainer;
