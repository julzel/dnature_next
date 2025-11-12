'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

// local imports
// components
import CartActions from './CartActions';

// contexts
import { useCartContext } from '../../../contexts/shopping-cart-context';

const CartActionsContainer = ({ proceedToPurchase }) => {
  const [displayRemoveAllModal, setDisplayRemoveAllModal] = useState(false);
  const { removeAllItems, cart } = useCartContext();
  const router = useRouter();

  const handleRemoveAllItems = useCallback(() => {
    removeAllItems();
    setDisplayRemoveAllModal(false);
  }, [removeAllItems]);

  const toggleRemoveAllModal = useCallback(() => {
    setDisplayRemoveAllModal(!displayRemoveAllModal);
  }, [displayRemoveAllModal]);

  return (
    <CartActions
      router={router}
      totalItems={cart.totalItems}
      proceedToPurchase={proceedToPurchase}
      handleRemoveAllItems={handleRemoveAllItems}
      displayRemoveAllModal={displayRemoveAllModal}
      toggleRemoveAllModal={toggleRemoveAllModal}
    />
  );
};

export default CartActionsContainer;
