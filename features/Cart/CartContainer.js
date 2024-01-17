import React, { useState, useRef, useCallback, useEffect } from 'react';

// local imports
// components
import Cart from './Cart';

// contexts
import { useCartContext } from '../../contexts/shopping-cart-context';

// util
import { downloadScreenShot, captureElementScreenshot } from '../../util';

const CartContainer = () => {
  // Shopping cart context
  const {
    cart,
    updateCartClient,
    storeCartInLocalStorage,
  } = useCartContext();
  
  // State management
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [requestClientInfo, setRequestClientInfo] = useState(false);
  const [displayInfoModal, setDisplayInfoModal] = useState(false);
  const canvasElem = useRef(null);

  // Generate purchase link by capturing the screenshot and downloading it
  const generatePurchaseLink = useCallback(() => {
    captureElementScreenshot(canvasElem.current).then((dataUrl) => {
      downloadScreenShot(dataUrl, 'purchase-order.png');
      setShowPurchaseOrder(false);
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

  const handlePurchaseConfirm = () => {
    setDisplayInfoModal(true);
    generatePurchaseLink();
    storeCartInLocalStorage();
  };

  const handleCloseInfoModal = () => setDisplayInfoModal(false);

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
      onPurchaseConfirm={handlePurchaseConfirm}
      displayInfoModal={displayInfoModal}
      onCloseInfoModal={handleCloseInfoModal}
    />
  );
};

export default CartContainer;
