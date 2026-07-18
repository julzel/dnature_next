'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useSyncExternalStore,
} from 'react';
import { ShoppingCart } from '../models/shopping-cart';
import { generatePurchaseOrderId } from '../util/id-generator';

const CART_STORAGE_KEY = 'carts';
const CART_STORAGE_EVENT = 'dnature-cart-history';
const CART_STORAGE_VERSION = 1;
const MAX_SAVED_CARTS = 5;

const ShoppingCartContext = createContext();

const createEmptyCart = () => ({ ...new ShoppingCart(), items: [] });

const normalizeClient = (client = {}) => {
  const emptyClient = createEmptyCart().client;

  return {
    ...emptyClient,
    ...client,
    address: {
      ...emptyClient.address,
      ...client.address,
    },
    pets: Array.isArray(client.pets) ? client.pets : [],
  };
};

const normalizeItem = (item) => {
  const quantity = Number(item?.quantity);
  const price = Number(item?.price);

  if (!item?.id || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price)) {
    return null;
  }

  return {
    id: String(item.id),
    quantity,
    price,
    productName: item.productName || '',
  };
};

const totalsFor = (items) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    tax: 0,
    total: subtotal,
  };
};

const withItems = (cart, items, resetPurchase = false) => {
  const normalizedItems = items.map(normalizeItem).filter(Boolean);

  return {
    ...cart,
    items: normalizedItems,
    ...totalsFor(normalizedItems),
    ...(resetPurchase
      ? {
          date: null,
          purchaseOrderId: null,
          purchaseOrderDate: null,
        }
      : {}),
  };
};

const normalizeCart = (cart) => {
  if (!cart || typeof cart !== 'object') {
    return createEmptyCart();
  }

  return withItems(
    {
      ...createEmptyCart(),
      date: typeof cart.date === 'string' ? cart.date : null,
      purchaseOrderId:
        typeof cart.purchaseOrderId === 'string' ? cart.purchaseOrderId : null,
      purchaseOrderDate:
        typeof cart.purchaseOrderDate === 'string' ? cart.purchaseOrderDate : null,
      discount: Number.isFinite(Number(cart.discount)) ? Number(cart.discount) : 0,
      client: normalizeClient(cart.client),
    },
    Array.isArray(cart.items) ? cart.items : []
  );
};

const parseStoredCarts = (rawValue) => {
  try {
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    const carts = Array.isArray(parsed)
      ? parsed
      : parsed?.version === CART_STORAGE_VERSION && Array.isArray(parsed.carts)
        ? parsed.carts
        : [];

    return carts.map(normalizeCart);
  } catch (error) {
    console.warn('Unable to read saved carts from local storage.', error);
    return [];
  }
};

const readStoredCarts = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return parseStoredCarts(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch (error) {
    console.warn('Unable to access saved carts in local storage.', error);
    return [];
  }
};

const writeStoredCarts = (carts) => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ version: CART_STORAGE_VERSION, carts })
    );
    window.dispatchEvent(new CustomEvent(CART_STORAGE_EVENT));
    return true;
  } catch (error) {
    console.warn('Unable to save cart history to local storage.', error);
    return false;
  }
};

const cartReducer = (cart, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const incomingItem = normalizeItem(action.item);

      if (!incomingItem) {
        return cart;
      }

      const items = [...cart.items];
      const itemIndex = items.findIndex((item) => item.id === incomingItem.id);

      if (itemIndex === -1) {
        items.push(incomingItem);
      } else {
        items[itemIndex] = {
          ...items[itemIndex],
          quantity: items[itemIndex].quantity + incomingItem.quantity,
        };
      }

      return withItems(cart, items, true);
    }

    case 'REMOVE_ONE': {
      const itemIndex = cart.items.findIndex((item) => item.id === action.itemId);

      if (itemIndex === -1) {
        return cart;
      }

      const currentItem = cart.items[itemIndex];
      const items =
        currentItem.quantity === 1
          ? cart.items.filter((_, index) => index !== itemIndex)
          : cart.items.map((item, index) =>
              index === itemIndex ? { ...item, quantity: item.quantity - 1 } : item
            );

      return withItems(cart, items, true);
    }

    case 'REMOVE_ALL_OF_KIND':
      return withItems(
        cart,
        cart.items.filter((item) => item.id !== action.itemId),
        true
      );

    case 'REMOVE_ALL':
      return createEmptyCart();

    case 'SET_CLIENT':
      return {
        ...cart,
        client: normalizeClient(action.client),
        date: null,
        purchaseOrderId: null,
        purchaseOrderDate: null,
      };

    case 'SELECT_CART':
      return normalizeCart(action.cart);

    case 'FINALIZE_PURCHASE': {
      if (cart.purchaseOrderId && cart.purchaseOrderDate) {
        return cart;
      }

      return {
        ...cart,
        client: action.client ? normalizeClient(action.client) : cart.client,
        date: action.timestamp,
        purchaseOrderId: action.purchaseOrderId,
        purchaseOrderDate: action.timestamp,
      };
    }

    default:
      return cart;
  }
};

const ShoppingCartContextProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, undefined, createEmptyCart);
  const subscribeToSavedCarts = useCallback((callback) => {
    const onStorageChange = (event) => {
      if (event.type === CART_STORAGE_EVENT || event.key === CART_STORAGE_KEY) {
        callback();
      }
    };

    window.addEventListener('storage', onStorageChange);
    window.addEventListener(CART_STORAGE_EVENT, onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener(CART_STORAGE_EVENT, onStorageChange);
    };
  }, []);
  const getSavedCartsSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(CART_STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to access saved carts in local storage.', error);
      return null;
    }
  }, []);
  const getServerSavedCartsSnapshot = useCallback(() => null, []);
  const savedCarts = useSyncExternalStore(
    subscribeToSavedCarts,
    getSavedCartsSnapshot,
    getServerSavedCartsSnapshot
  );
  const localCarts = useMemo(() => parseStoredCarts(savedCarts), [savedCarts]);

  const addItems = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', item });
  }, []);

  const addOneItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', item: { ...item, quantity: 1 } });
  }, []);

  const removeOneItem = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ONE', itemId });
  }, []);

  const removeAllItems = useCallback(() => {
    dispatch({ type: 'REMOVE_ALL' });
  }, []);

  const removeAllItemsOfAKind = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ALL_OF_KIND', itemId });
  }, []);

  const updateCartClient = useCallback((client) => {
    dispatch({ type: 'SET_CLIENT', client });
  }, []);

  const updateCurrentCart = useCallback((savedCart) => {
    dispatch({ type: 'SELECT_CART', cart: savedCart });
  }, []);

  const finalizePurchase = useCallback((client) => {
    dispatch({
      type: 'FINALIZE_PURCHASE',
      client,
      purchaseOrderId: generatePurchaseOrderId(),
      timestamp: new Date().toISOString(),
    });
  }, []);

  const storeCartInLocalStorage = useCallback(() => {
    const nextCarts = [...readStoredCarts(), normalizeCart(cart)].slice(-MAX_SAVED_CARTS);

    if (!writeStoredCarts(nextCarts)) {
      return false;
    }

    return true;
  }, [cart]);

  const getItemsInCart = useCallback(
    (itemId) => cart.items.find((item) => item.id === itemId)?.quantity || 0,
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      localCarts,
      getItemsInCart,
      addItems,
      addOneItem,
      removeOneItem,
      removeAllItems,
      removeAllItemsOfAKind,
      updateCartClient,
      updateCurrentCart,
      finalizePurchase,
      storeCartInLocalStorage,
    }),
    [
      addItems,
      addOneItem,
      cart,
      finalizePurchase,
      getItemsInCart,
      localCarts,
      removeAllItems,
      removeAllItemsOfAKind,
      removeOneItem,
      storeCartInLocalStorage,
      updateCartClient,
      updateCurrentCart,
    ]
  );

  return <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>;
};

export default ShoppingCartContextProvider;
export const useCartContext = () => useContext(ShoppingCartContext);
export {
  CART_STORAGE_VERSION,
  cartReducer,
  createEmptyCart,
  normalizeCart,
  parseStoredCarts,
};
