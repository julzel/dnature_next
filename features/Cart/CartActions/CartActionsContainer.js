import React from "react";
import { useRouter } from "next/router";

// local imports
// components
import CartActions from "./CartActions";

const CartActionsContainer = ({ proceedToPurchase }) => {
  const router = useRouter();
  return (
    <CartActions router={router} proceedToPurchase={proceedToPurchase} />
  );
};

export default CartActionsContainer;
