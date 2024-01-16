import React, { useState, useRef, useCallback } from 'react';

// local imports
// components
import Cart from './Cart';

// contexts
import { useCartContext } from '../../contexts/shopping-cart-context';

// util
import { downloadScreenShot, captureElementScreenshot } from '../../util';

const CartContainer = () => {
  // State management
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [requestClientInfo, setRequestClientInfo] = useState(false);
  const [displayInfoModal, setDisplayInfoModal] = useState(false);
  const { cart, updateCartClient } = useCartContext();
  const canvasElem = useRef(null);

  // store the cart in local storage array to handle up to 5 carts in local storage
  const storeCartInLocalStorage = useCallback(() => {
    const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    if (storedCarts.length >= 5) {
      // If array is full, delete the oldest cart (FIFO)
      storedCarts.shift();
    }
    storedCarts.push(cart);
    localStorage.setItem('carts', JSON.stringify(storedCarts));
  }, [cart]);

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

  const handleCloseInfoModal = () => {
    // removeAllItems();
    setDisplayInfoModal(false);
  };

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
