import React, { useState, useEffect, useRef, useCallback } from "react";

// local imports
// components
import Cart from "./Cart";

// contexts
import { useCartContext } from "../../contexts/shopping-cart-context";

// util
import { downloadScreenShot, captureElementScreenshot } from "../../util";

const CartContainer = () => {
  // State management
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [requestClientInfo, setRequestClientInfo] = useState(false);
  const [downloadPurchaseOrder, setDownloadPurchaseOrder] = useState(false);
  const { cart, updateCartClient } = useCartContext();
  const canvasElem = useRef(null);

  // Generate purchase link by capturing the screenshot and downloading it
  const generatePurchaseLink = useCallback(() => {
    captureElementScreenshot(canvasElem.current).then((dataUrl) => {
      downloadScreenShot(dataUrl, "purchase-order.png");
      setDownloadPurchaseOrder(false);
    });
  }, []);

  // Update cart client information and show purchase order
  const onClientInfoSubmit = (client) => {
    updateCartClient(client);
    setRequestClientInfo(false);
    setShowPurchaseOrder(true);
  };

  // Proceed to purchase, either show the purchase order or request client info
  const proceedToPurchase = () => {
    if (cart.client.firstName) {
      setShowPurchaseOrder(true);
    } else {
      setRequestClientInfo(true);
    }
  };

  // Effect to handle the download of the purchase order
  useEffect(() => {
    if (downloadPurchaseOrder) {
      generatePurchaseLink();
    }
  }, [downloadPurchaseOrder, generatePurchaseLink]);

  return (
    <Cart
      cart={cart}
      proceedToPurchase={proceedToPurchase}
      showPurchaseOrder={showPurchaseOrder}
      canvasElem={canvasElem}
      requestClientInfo={requestClientInfo}
      closeClientInfoModal={() => setRequestClientInfo(false)}
      onClientInfoSubmit={onClientInfoSubmit}
      onPurchaseCancel={() => setShowPurchaseOrder(false)}
      onPurchaseConfirm={() => setDownloadPurchaseOrder(true)}
      downloadPurchaseOrder={downloadPurchaseOrder}
    />
  );
};

export default CartContainer;
