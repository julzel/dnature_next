import React from "react";

// local imports
// contexts
import { useCartContext } from "../../contexts/shopping-cart-context";

// components
import Cart from "./Cart";

const CartContainer = () => {
  const { cart, addItem, removeItem, removeAllItems, removeAllItemsOfAKind } = useCartContext();

  return (
    <Cart
      cart={cart}
      addItem={addItem}
      removeItem={removeItem}
      removeAllItems={removeAllItems}
      removeAllItemsOfAKind={removeAllItemsOfAKind}
    />
  );
};

export default CartContainer;
