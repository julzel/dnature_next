import React, { useState } from "react";
import { useRouter } from "next/navigation";

// local imports
// components
import CartActions from "./CartActions";

// contexts
import { useCartContext } from "../model/shopping-cart-context";

const CartActionsContainer = ({ proceedToPurchase, isCheckingCart = false }) => {
  const [displayRemoveAllModal, setDisplayRemoveAllModal] = useState(false);
  const { removeAllItems, cart } = useCartContext();
  const router = useRouter();

  const handleRemoveAllItems = () => {
    removeAllItems();
    setDisplayRemoveAllModal(false);
  };

  return (
    <CartActions
      onBack={() => router.back()}
      totalItems={cart.totalItems}
      proceedToPurchase={proceedToPurchase}
      handleRemoveAllItems={handleRemoveAllItems}
      displayRemoveAllModal={displayRemoveAllModal}
      toggleRemoveAllModal={() =>
        setDisplayRemoveAllModal(!displayRemoveAllModal)
      }
      isCheckingCart={isCheckingCart}
    />
  );
};

export default CartActionsContainer;
