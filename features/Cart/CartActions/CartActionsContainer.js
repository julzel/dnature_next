import React, { useState } from "react";

// local imports
// components
import CartActions from "./CartActions";

// contexts
import { useCartContext } from "../../../contexts/shopping-cart-context";
import useCompatibleNavigation from "../../../hooks/useCompatibleNavigation";

const CartActionsContainer = ({ proceedToPurchase }) => {
  const [displayRemoveAllModal, setDisplayRemoveAllModal] = useState(false);
  const { removeAllItems, cart } = useCartContext();
  const { back } = useCompatibleNavigation();

  const handleRemoveAllItems = () => {
    removeAllItems();
    setDisplayRemoveAllModal(false);
  };

  return (
    <CartActions
      onBack={back}
      totalItems={cart.totalItems}
      proceedToPurchase={proceedToPurchase}
      handleRemoveAllItems={handleRemoveAllItems}
      displayRemoveAllModal={displayRemoveAllModal}
      toggleRemoveAllModal={() =>
        setDisplayRemoveAllModal(!displayRemoveAllModal)
      }
    />
  );
};

export default CartActionsContainer;
