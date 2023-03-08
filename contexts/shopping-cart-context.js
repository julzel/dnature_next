import { createContext, useContext, useState } from 'react';
import { shoppingCart as defaultShoppingCart } from '../models/shopping-cart';

const ShoppingCartContext = createContext();

const ShoppingCartContextProvider = ({ children }) => {
  const [currentShoppingCart, setCurrentShoppingCart] =
    useState(defaultShoppingCart);

  let totalItems = 0;

  const updateShoppingCart = (newShoppingCart) => {
    const subtotal = newShoppingCart.items.reduce((acc, item) => {
      totalItems += item.quantity;
      return acc + item.quantity * item.price;
    }, 0);
    const total = subtotal;
    setCurrentShoppingCart({ ...newShoppingCart, subtotal, total, totalItems });
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cart: currentShoppingCart,
        updateCart: updateShoppingCart,
        defaultCart: defaultShoppingCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartContextProvider;

export const useShoppingCartContext = () => useContext(ShoppingCartContext);
