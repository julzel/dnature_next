import React from "react";
import CartPurchaseOrder from "./CartPurchaseOrder";

const CartPurchaseOrderContainer = ({
  onPurchaseCancel,
  onPurchaseConfirm,
  onPurchaseEdit,
  purchaseError,
  isCapturingPurchase,
}) => {
  return (
    <CartPurchaseOrder
      onPurchaseCancel={onPurchaseCancel}
      onPurchaseConfirm={onPurchaseConfirm}
      onPurchaseEdit={onPurchaseEdit}
      purchaseError={purchaseError}
      isCapturingPurchase={isCapturingPurchase}
    />
  );
};

export default CartPurchaseOrderContainer;
