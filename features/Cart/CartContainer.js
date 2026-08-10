import React, { useState, useRef, useCallback, useEffect } from 'react';

// local imports
// components
import Cart from './Cart';

// contexts
import { useCartContext } from './model/shopping-cart-context';

// util
import {
  downloadScreenShot,
  captureElementScreenshot,
} from './lib/purchase-image';
import { reconcileCheckoutCartAction } from './actions';
import { buildWhatsAppOrderUrl } from './lib/whatsapp-order';

const completePurchaseCapture = async ({
  element,
  capture = captureElementScreenshot,
  download = downloadScreenShot,
  store,
  filename = 'solicitud-dnature.png',
}) => {
  const dataUrl = await capture(element);

  if (!dataUrl) {
    throw new Error('No se pudo generar la imagen de la solicitud.');
  }

  download(dataUrl, filename);

  const storageWarning = store()
    ? ''
    : 'La imagen se descargó, pero no pudimos guardar una referencia local en este dispositivo.';

  return {
    dataUrl,
    filename,
    ...(storageWarning ? { storageWarning } : {}),
  };
};

const cartItemsSignature = (items) =>
  JSON.stringify(
    (Array.isArray(items) ? items : []).map((item) => [
      item.id,
      item.catalogProductId,
      item.presentation,
      item.quantity,
      item.price,
    ])
  );

const CartContainer = ({ canCreateAccount = false, initialClient = null }) => {
  // Shopping cart context
  const {
    cart,
    finalizePurchase,
    removeAllItems,
    replaceCartItems,
    storeCartInLocalStorage,
    updateDelivery,
    updateOrderNotes,
    updatePaymentMethod,
  } = useCartContext();
  
  // State management
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [requestClientInfo, setRequestClientInfo] = useState(false);
  const [displayInfoModal, setDisplayInfoModal] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [isCapturingPurchase, setIsCapturingPurchase] = useState(false);
  const [isCheckingCart, setIsCheckingCart] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [purchaseArtifact, setPurchaseArtifact] = useState(null);
  const [handoffWarning, setHandoffWarning] = useState('');
  const canvasElem = useRef(null);
  const currentItemsRef = useRef(cart.items);
  const checkoutReturnFocusRef = useRef(null);

  useEffect(() => {
    currentItemsRef.current = cart.items;
  }, [cart.items]);

  // Generate purchase link by capturing the screenshot and downloading it
  const generatePurchaseLink = useCallback(async () => {
    setPurchaseError('');
    setHandoffWarning('');
    setIsCapturingPurchase(true);

    try {
      const artifact = await completePurchaseCapture({
        element: canvasElem.current,
        store: storeCartInLocalStorage,
        filename: `solicitud-${cart.purchaseOrderId || 'dnature'}.png`,
      });

      setPurchaseArtifact(artifact);
      setHandoffWarning(artifact.storageWarning || '');
      setShowPurchaseOrder(false);
      setDisplayInfoModal(true);
    } catch (error) {
      console.error('Unable to complete purchase-order capture:', error);
      setPurchaseArtifact(null);
      setHandoffWarning(
        'No pudimos descargar la imagen. Podés continuar con el resumen de productos incluido en WhatsApp o volver a intentarlo.'
      );
      setShowPurchaseOrder(false);
      setDisplayInfoModal(true);
    } finally {
      setIsCapturingPurchase(false);
    }
  }, [cart.purchaseOrderId, storeCartInLocalStorage]);

  // Update cart client information and show purchase order
  const onClientInfoSubmit = (client) => {
    finalizePurchase(client);
    setRequestClientInfo(false);
    setShowPurchaseOrder(true);
  };

  // Verify mutable catalogue data before collecting personal information.
  const proceedToPurchase = async () => {
    setPurchaseError('');
    setCheckoutMessage(null);
    checkoutReturnFocusRef.current = document.activeElement;

    if (!cart.paymentMethod) {
      setCheckoutMessage({
        error: true,
        text: 'Elegí cómo preferís coordinar el pago antes de continuar.',
      });
      return;
    }

    const requestedItems = cart.items;
    const requestedItemsSignature = cartItemsSignature(requestedItems);
    setIsCheckingCart(true);
    let result;
    try {
      result = await reconcileCheckoutCartAction(requestedItems);
    } catch {
      result = {
        ok: false,
        message:
          'No pudimos comprobar el carrito. Revisá tu conexión e intentá nuevamente.',
      };
    } finally {
      setIsCheckingCart(false);
    }

    if (
      cartItemsSignature(currentItemsRef.current) !== requestedItemsSignature
    ) {
      setCheckoutMessage({
        error: false,
        text: 'El carrito cambió mientras lo comprobábamos. Revisalo y continuá nuevamente.',
      });
      return;
    }

    if (!result.ok) {
      if (Array.isArray(result.items)) replaceCartItems(result.items);
      setCheckoutMessage({ error: true, text: result.message });
      return;
    }

    replaceCartItems(result.items);

    if (result.changed) {
      setCheckoutMessage({ error: false, text: result.message });
      return;
    }

    setRequestClientInfo(true);
  };

  const handlePurchaseConfirm = () => generatePurchaseLink();

  const handleCloseInfoModal = () => setDisplayInfoModal(false);

  const handleEditClient = () => {
    setShowPurchaseOrder(false);
    setRequestClientInfo(true);
  };

  const handleDownloadAgain = () => {
    if (!purchaseArtifact) return;
    downloadScreenShot(purchaseArtifact.dataUrl, purchaseArtifact.filename);
  };

  const handleStartAnotherOrder = () => {
    removeAllItems();
    setPurchaseArtifact(null);
    setHandoffWarning('');
    setDisplayInfoModal(false);
  };

  return (
    <Cart
      cart={cart}
      updateDelivery={updateDelivery}
      updatePaymentMethod={updatePaymentMethod}
      updateOrderNotes={updateOrderNotes}
      proceedToPurchase={proceedToPurchase}
      isCheckingCart={isCheckingCart}
      checkoutMessage={checkoutMessage}
      showPurchaseOrder={showPurchaseOrder}
      canvasElem={canvasElem}
      requestClientInfo={requestClientInfo}
      closeClientInfoModal={() => setRequestClientInfo(false)}
      onClientInfoSubmit={onClientInfoSubmit}
      onPurchaseCancel={() => setShowPurchaseOrder(false)}
      onPurchaseEdit={handleEditClient}
      onPurchaseConfirm={handlePurchaseConfirm}
      displayInfoModal={displayInfoModal}
      onCloseInfoModal={handleCloseInfoModal}
      purchaseError={purchaseError}
      isCapturingPurchase={isCapturingPurchase}
      initialClient={initialClient}
      canCreateAccount={canCreateAccount}
      whatsappUrl={buildWhatsAppOrderUrl(cart)}
      onDownloadAgain={handleDownloadAgain}
      onStartAnotherOrder={handleStartAnotherOrder}
      handoffWarning={handoffWarning}
      hasPurchaseArtifact={Boolean(purchaseArtifact)}
      checkoutReturnFocusRef={checkoutReturnFocusRef}
    />
  );
};

export default CartContainer;
export { cartItemsSignature, completePurchaseCapture };
