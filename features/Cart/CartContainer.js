import React, { useState, useEffect, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { useCartContext } from "../../contexts/shopping-cart-context";
import Cart from "./Cart";

const CartContainer = () => {
  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const canvasElem = useRef(null);
  const {
    cart,
    addOneItem,
    addItems,
    removeOneItem,
    removeAllItems,
    removeAllItemsOfAKind,
  } = useCartContext();

  const generatePurchaseLink = useCallback(() => {
    // // Use html2canvas to convert the div to an image
    // html2canvas(canvasElem.current).then(async (canvas) => {
    //   // Create a new link object and set its href to the canvas data
    //   var link = document.createElement("a");
    //   link.href = canvas.toDataURL("image/png");

    //   // Set the link object's attributes to enable downloading the image
    //   link.download = "my-image.png";

    //   // Click the link object to download the image
    //   link.click();
    // });
  }, []);

  const createPurchaseOrder = () => {
    // Display the purchase order
    setShowPurchaseOrder(true);
  };

  useEffect(() => {
    if (showPurchaseOrder) {
      generatePurchaseLink();
    }
  }, [generatePurchaseLink, showPurchaseOrder]);

  return (
    <Cart
      cart={cart}
      addItems={addItems}
      addOneItem={addOneItem}
      removeOneItem={removeOneItem}
      removeAllItems={removeAllItems}
      removeAllItemsOfAKind={removeAllItemsOfAKind}
      createPurchaseOrder={createPurchaseOrder}
      showPurchaseOrder={showPurchaseOrder}
      canvasElem={canvasElem}
    />
  );
};

export default CartContainer;
