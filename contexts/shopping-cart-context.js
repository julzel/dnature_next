import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { ShoppingCart, ShoppingCartItem } from '../models/shopping-cart';

const ShoppingCartContext = createContext();

const ShoppingCartContextProvider = ({ children }) => {
  const [currentShoppingCart, setCurrentShoppingCart] = useState(
    () => new ShoppingCart()
  );
  const [localCarts, setLocalCarts] = useState([]);

  // Function to store the cart in local storage
  const storeCartInLocalStorage = useCallback(() => {
    const storedCarts = JSON.parse(localStorage.getItem('carts')) || [];
    if (storedCarts.length >= 5) {
      storedCarts.shift(); // Remove the oldest cart
    }
    storedCarts.push(currentShoppingCart); // Add the current cart
    localStorage.setItem('carts', JSON.stringify(storedCarts));
    setLocalCarts(storedCarts);
  }, [currentShoppingCart]);

  // Function to retrieve the cart from local storage
  const getLocalCarts = useCallback(() => {
    const storedCartsString = localStorage.getItem('carts');
    try {
      const storedCarts = JSON.parse(storedCartsString);
      return Array.isArray(storedCarts) ? storedCarts : [];
    } catch (error) {
      // In case the stored value is not valid JSON
      return [];
    }
  }, []);

  const updateCurrentCart = useCallback(
    (newCart) => {
      setCurrentShoppingCart(newCart);
    },
    [setCurrentShoppingCart]
  );

  const updateCartClient = useCallback(
    (client) => {
      const updatedCart = { ...currentShoppingCart };
      updatedCart.client = client;
      setCurrentShoppingCart(updatedCart);
    },
    [currentShoppingCart]
  );

  const addOneToCart = useCallback(
    (item) => {
      const { id } = item;
      const foundItem = currentShoppingCart.items.find(
        (shoppingCartItem) => shoppingCartItem.id === id
      );
      if (foundItem) {
        foundItem.quantity += 1;
      } else {
        const newItem = new ShoppingCartItem(
          id,
          1,
          item.price,
          item.productName,
          item.containers
        );
        currentShoppingCart.items.push(newItem);
      }
      const updatedCart = { ...currentShoppingCart };
      updatedCart.totalItems += 1;
      updatedCart.subtotal += item.price;
      updatedCart.tax += 0;
      updatedCart.total = updatedCart.subtotal + updatedCart.tax;
      setCurrentShoppingCart(updatedCart);
    },
    [currentShoppingCart]
  );

  const addToCart = useCallback(
    (item) => {
      const { id } = item;
      const foundItem = currentShoppingCart.items.find(
        (shoppingCartItem) => shoppingCartItem.id === id
      );
      if (foundItem) {
        foundItem.quantity += item.quantity;
      } else {
        currentShoppingCart.items.push(item);
      }
      const updatedCart = { ...currentShoppingCart };
      updatedCart.totalItems += item.quantity;
      updatedCart.subtotal += item.price * item.quantity;
      updatedCart.tax += 0;
      updatedCart.total = updatedCart.subtotal + updatedCart.tax;
      setCurrentShoppingCart(updatedCart);
    },
    [currentShoppingCart]
  );

  const removeFromCart = useCallback(
    (itemId) => {
      const itemIndex = currentShoppingCart.items.findIndex(
        (shoppingCartItem) => shoppingCartItem.id === itemId
      );
      if (itemIndex === -1) {
        return; // item not found in cart
      }
      const itemToRemove = currentShoppingCart.items[itemIndex];
      if (itemToRemove.quantity === 1) {
        currentShoppingCart.items.splice(itemIndex, 1);
      } else {
        itemToRemove.quantity -= 1;
      }
      const updatedCart = { ...currentShoppingCart };
      updatedCart.totalItems -= 1;
      updatedCart.subtotal -= itemToRemove.price;
      updatedCart.tax = 0;
      updatedCart.total = updatedCart.subtotal + updatedCart.tax;
      setCurrentShoppingCart(updatedCart);
    },
    [currentShoppingCart]
  );

  const removeAllFromCart = useCallback(() => {
    setCurrentShoppingCart(new ShoppingCart());
  }, []);

  const removeAllOfAKindFromCart = useCallback(
    (itemId) => {
      const itemIndex = currentShoppingCart.items.findIndex(
        (shoppingCartItem) => shoppingCartItem.id === itemId
      );
      if (itemIndex !== -1) {
        const foundItem = currentShoppingCart.items[itemIndex];
        const updatedCart = { ...currentShoppingCart };
        updatedCart.items.splice(itemIndex, 1);
        updatedCart.totalItems -= foundItem.quantity;
        updatedCart.subtotal -= foundItem.price * foundItem.quantity;
        updatedCart.tax = 0;
        updatedCart.total = updatedCart.subtotal + updatedCart.tax;
        setCurrentShoppingCart(updatedCart);
      }
    },
    [currentShoppingCart]
  );

  const getItemsInCart = (itemId) => {
    const itemInCart = currentShoppingCart.items.find((item) => item.id === itemId);
    return itemInCart ? itemInCart.quantity : '';
  };

  useEffect(() => {
    setLocalCarts(getLocalCarts());
  }, [getLocalCarts]);

  return (
    <ShoppingCartContext.Provider
      value={{
        cart: currentShoppingCart,
        localCarts: localCarts,
        getItemsInCart: getItemsInCart,
        addItems: addToCart,
        addOneItem: addOneToCart,
        removeOneItem: removeFromCart,
        removeAllItems: removeAllFromCart,
        removeAllItemsOfAKind: removeAllOfAKindFromCart,
        updateCartClient: updateCartClient,
        updateCurrentCart: updateCurrentCart,
        storeCartInLocalStorage: storeCartInLocalStorage,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export default ShoppingCartContextProvider;
export const useCartContext = () => useContext(ShoppingCartContext);
