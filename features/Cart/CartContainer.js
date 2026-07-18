import React, { useState, useRef, useCallback } from 'react';

// local imports
// components
import Cart from './Cart';

// contexts
import { useCartContext } from '../../contexts/shopping-cart-context';

// util
import { downloadScreenShot, captureElementScreenshot } from '../../util/images';

const CartContainer = () => {
  // Shopping cart context
  const {
    cart,
    finalizePurchase,
    storeCartInLocalStorage,
  } = useCartContext();
  
  // State management
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [requestClientInfo, setRequestClientInfo] = useState(false);
  const [displayInfoModal, setDisplayInfoModal] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [isCapturingPurchase, setIsCapturingPurchase] = useState(false);
  const canvasElem = useRef(null);

  // Generate purchase link by capturing the screenshot and downloading it
  const generatePurchaseLink = useCallback(async () => {
    setPurchaseError('');
    setIsCapturingPurchase(true);

    try {
      const dataUrl = await captureElementScreenshot(canvasElem.current);

      if (!dataUrl) {
        throw new Error('No se pudo generar la imagen de la orden.');
      }

      downloadScreenShot(dataUrl, 'purchase-order.png');

      if (!storeCartInLocalStorage()) {
        throw new Error('No se pudo guardar la orden en este dispositivo.');
      }

      setShowPurchaseOrder(false);
      setDisplayInfoModal(true);
    } catch (error) {
      console.error('Unable to complete purchase-order capture:', error);
      setPurchaseError(error.message || 'No se pudo generar la orden. Intenta nuevamente.');
    } finally {
      setIsCapturingPurchase(false);
    }
  }, [storeCartInLocalStorage]);

  // Update cart client information and show purchase order
  const onClientInfoSubmit = (client) => {
    finalizePurchase(client);
    setRequestClientInfo(false);
    setShowPurchaseOrder(true);
  };

  // Proceed to purchase, either show the purchase order or request client info
  const proceedToPurchase = () => {
    setPurchaseError('');

    if (cart.client.firstName) {
      finalizePurchase();
      setShowPurchaseOrder(true);
    } else {
      setRequestClientInfo(true);
    }
  };

  const handlePurchaseConfirm = () => generatePurchaseLink();

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
      purchaseError={purchaseError}
      isCapturingPurchase={isCapturingPurchase}
    />
  );
};

export default CartContainer;
