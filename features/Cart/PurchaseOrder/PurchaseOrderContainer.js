import React from "react";

// local imports
// components
import PurchaseOrder from "./PurchaseOrder";

// context
import { useCartContext } from "../../../contexts/shopping-cart-context";

// utils
import { generatePurchaseOrderId } from "../../../util";

const PurchaseOrderContainer = () => {
  const { cart } = useCartContext();

  return (
    <PurchaseOrder
      cart={cart}
      generatePurchaseOrderId={generatePurchaseOrderId}
    />
  );
};

export default PurchaseOrderContainer;
