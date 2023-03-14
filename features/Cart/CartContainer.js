import React, { useState, useEffect, useRef, useCallback } from "react";

// local imports
// components
import Cart from "./Cart";

// contexts
import { useCartContext } from "../../contexts/shopping-cart-context";

// util

const CartContainer = () => {
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [requestClientInfo, setRequestClientInfo] = useState(false);
  const { cart, updateCartClient } = useCartContext();
  const canvasElem = useRef(null);

  const generatePurchaseLink = useCallback(() => {
   
  }, []);


  const onClientInfoSubmit = (client) => {
    updateCartClient(client);
    setRequestClientInfo(false);
    setShowPurchaseOrder(true);
  };

  const proceedToPurchase = () => {
    if (cart.client.firstName) {
      setShowPurchaseOrder(true);
    } else {
      setRequestClientInfo(true)
    }
  };

  useEffect(() => {
    if (showPurchaseOrder) {
      generatePurchaseLink();
    }
  }, [generatePurchaseLink, showPurchaseOrder]);

  return (
    <Cart
      cart={cart}
      proceedToPurchase={proceedToPurchase}
      showPurchaseOrder={showPurchaseOrder}
      canvasElem={canvasElem}
      requestClientInfo={requestClientInfo}
      closeClientInfoModal={() => setRequestClientInfo(false)}
      onClientInfoSubmit={onClientInfoSubmit}
    />
  );
};

export default CartContainer;
