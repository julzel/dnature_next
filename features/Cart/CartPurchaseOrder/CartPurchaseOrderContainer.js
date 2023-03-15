import React from "react";
import CartPurchaseOrder from "./CartPurchaseOrder";

const CartPurchaseOrderContainer = ({ onPurchaseCancel, onPurchaseConfirm }) => {
  return (
    <CartPurchaseOrder
      onPurchaseCancel={onPurchaseCancel}
      onPurchaseConfirm={onPurchaseConfirm}
    />
  );
};

export default CartPurchaseOrderContainer;
