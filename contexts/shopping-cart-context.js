import { createContext, useContext, useCallback, useState } from "react";
import { ShoppingCart, ShoppingCartItem } from "../models/shopping-cart";

const ShoppingCartContext = createContext();

const ShoppingCartContextProvider = ({ children }) => {
  const [currentShoppingCart, setCurrentShoppingCart] = useState(
    () => new ShoppingCart()
  );

  const addToCart = useCallback(
    (item) => {
      const { id } = item;
      console.log(item)
      const foundItem = currentShoppingCart.items.find(
        (shoppingCartItem) => shoppingCartItem.id === id
      );
      if (foundItem) {
        foundItem.quantity += item.quantity;
        foundItem.containers = [...foundItem.containers, ...item.containers];
      } else {
        const newItem = new ShoppingCartItem(
          id,
          item.quantity,
          item.price,
          item.productName,
          item.containers
        );
        currentShoppingCart.items.push(newItem);
      }
      const updatedCart = { ...currentShoppingCart };
      updatedCart.totalItems += item.quantity;
      updatedCart.subtotal += (item.price * item.quantity);
      updatedCart.tax += 0;
      updatedCart.total = updatedCart.subtotal + updatedCart.tax;
      setCurrentShoppingCart(updatedCart);
    },
    [currentShoppingCart]
  );

  const removeFromCart = useCallback(
    (item) => {
      const itemIndex = currentShoppingCart.items.findIndex(
        (shoppingCartItem) => shoppingCartItem.id === item.id
      );
      if (itemIndex === -1) {
        return; // item not found in cart
      }
      const itemToRemove = currentShoppingCart.items[itemIndex];
      currentShoppingCart.totalItems -= itemToRemove.quantity;
      currentShoppingCart.subtotal -=
        itemToRemove.price * itemToRemove.quantity;
      currentShoppingCart.tax -=
        itemToRemove.price * 0.1 * itemToRemove.quantity;
      currentShoppingCart.total =
        currentShoppingCart.subtotal + currentShoppingCart.tax;
      currentShoppingCart.items.splice(itemIndex, 1);
      const updatedCart = { ...currentShoppingCart };
      setCurrentShoppingCart(updatedCart);
    },
    [currentShoppingCart]
  );

  const removeAllFromCart = useCallback(() => {
    setCurrentShoppingCart(new ShoppingCart());
  }, []);

  const removeAllOfAKindFromCart = useCallback((item) => {
    const foundItem = currentShoppingCart.items.found(
      (shoppingCartItem) => shoppingCartItem.id === item.id
    );
    if (foundItem) {
      // currentShoppingCart.totalItems -= foundItem.quantity;
      // currentShoppingCart.subtotal -= foundItem.price * foundItem.quantity;
      // currentShoppingCart.tax -=
      //   foundItem.price * 0.1 * foundItem.quantity;
      // currentShoppingCart.total =
      //   currentShoppingCart.subtotal + currentShoppingCart.tax;
      // const itemIndex = currentShoppingCart.items.findIndex(
      //   (shoppingCartItem) => shoppingCartItem.id === item.id
      // );
      // currentShoppingCart.items.splice(itemIndex, 1);
      // const updatedCart = { ...currentShoppingCart };
      // setCurrentShoppingCart(updatedCart);
    }
  }, [currentShoppingCart])

  return (
    <ShoppingCartContext.Provider
      value={{
        cart: currentShoppingCart,
        addItem: addToCart,
        removeItem: removeFromCart,
        removeAllItems: removeAllFromCart,
        removeAllItemsOfAKind: removeAllOfAKindFromCart,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartContextProvider;
export const useCartContext = () => useContext(ShoppingCartContext);
