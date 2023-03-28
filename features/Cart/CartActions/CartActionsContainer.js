import React, { useState } from "react";
import { useRouter } from "next/router";

// local imports
// components
import CartActions from "./CartActions";

// contexts
import { useCartContext } from "../../../contexts/shopping-cart-context";

const CartActionsContainer = ({ proceedToPurchase }) => {
  const [displayRemoveAllModal, setDisplayRemoveAllModal] = useState(false);
  const { removeAllItems, cart } = useCartContext();
  const router = useRouter();

  const handleRemoveAllItems = () => {
    removeAllItems();
    setDisplayRemoveAllModal(false);
  };

  return (
    <CartActions
      router={router}
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
