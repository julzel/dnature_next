import React from "react";
import CartPurchaseOrder from "./CartPurchaseOrder";

const CartPurchaseOrderContainer = ({ onPurchaseCancel, onPurchaseConfirm, purchaseError, isCapturingPurchase }) => {
  return (
    <CartPurchaseOrder
      onPurchaseCancel={onPurchaseCancel}
      onPurchaseConfirm={onPurchaseConfirm}
      purchaseError={purchaseError}
      isCapturingPurchase={isCapturingPurchase}
    />
  );
};

export default CartPurchaseOrderContainer;
