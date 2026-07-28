'use client';

import React, { useCallback, useRef, useState } from 'react';

// local imports
// components
import SubHeader from './SubHeader';
import CartDrawer from '../../../features/Cart/CartDrawer';

// context
import { useCartContext } from "../../../features/Cart/state";

const SubHeaderContainer = () => {
  const { cart } = useCartContext();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const triggerRef = useRef(null);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <>
      <SubHeader
        totalCartItems={cart.totalItems}
        onOpen={() => setIsCartOpen(true)}
        triggerRef={triggerRef}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={closeCart}
        returnFocusRef={triggerRef}
      />
    </>
  );
};

export default SubHeaderContainer;
