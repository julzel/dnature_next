'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
} from 'react';
import { ShoppingCart } from './shopping-cart';
import { generatePurchaseOrderId } from '../lib/id-generator';
import { isPaymentMethod } from './checkout';

const CART_STORAGE_KEY = 'carts';
const CART_STORAGE_EVENT = 'dnature-cart-history';
const CART_STORAGE_VERSION = 3;
const ACTIVE_CART_STORAGE_KEY = 'dnature-active-cart-v1';
const ACTIVE_CART_STORAGE_VERSION = 1;
const ACTIVE_CART_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_SAVED_CARTS = 5;
const CART_RETENTION_DAYS = 30;
const CART_RETENTION_MS = CART_RETENTION_DAYS * 24 * 60 * 60 * 1000;
const IVA_RATE = 0.13;
const DELIVERY_FEE = 3500;
const MAX_ITEM_QUANTITY = 99;
const MAX_ORDER_NOTES_LENGTH = 300;

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

  if (
    !item?.id ||
    !Number.isInteger(quantity) ||
    quantity <= 0 ||
    quantity > MAX_ITEM_QUANTITY ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return null;
  }

  const normalizedItem = {
    id: String(item.id),
    quantity,
    price,
    productName: item.productName || '',
  };

  if (typeof item.image === 'string' && item.image.trim()) {
    normalizedItem.image = item.image;
  }

  if (typeof item.presentation === 'string' && item.presentation.trim()) {
    normalizedItem.presentation = item.presentation;
  }

  if (typeof item.sku === 'string' && item.sku.trim()) {
    normalizedItem.sku = item.sku;
  }

  if (typeof item.parentSku === 'string' && item.parentSku.trim()) {
    normalizedItem.parentSku = item.parentSku;
  }

  if (
    typeof item.avifyProductId === 'string' ||
    typeof item.avifyProductId === 'number'
  ) {
    normalizedItem.avifyProductId = item.avifyProductId;
  }

  if (
    typeof item.avifyVariantId === 'string' ||
    typeof item.avifyVariantId === 'number'
  ) {
    normalizedItem.avifyVariantId = item.avifyVariantId;
  }

  if (Array.isArray(item.avifyAttributes)) {
    normalizedItem.avifyAttributes = item.avifyAttributes
      .filter(
        (attribute) =>
          typeof attribute?.code === 'string' &&
          typeof attribute?.value === 'string'
      )
      .map(({ code, value }) => ({ code, value }));
  }

  if (
    typeof item.catalogProductId === 'string' &&
    item.catalogProductId.trim()
  ) {
    normalizedItem.catalogProductId = item.catalogProductId;
  }

  return normalizedItem;
};

const totalsFor = (items, wantsDelivery = false) => {
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * IVA_RATE);
  const deliveryFee = wantsDelivery && items.length > 0 ? DELIVERY_FEE : 0;

  return {
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    tax,
    deliveryFee,
    total: subtotal + tax + deliveryFee,
  };
};

const withItems = (cart, items, resetPurchase = false) => {
  const normalizedItems = items.map(normalizeItem).filter(Boolean);
  const wantsDelivery = normalizedItems.length > 0 && Boolean(cart.wantsDelivery);

  return {
    ...cart,
    wantsDelivery,
    items: normalizedItems,
    ...totalsFor(normalizedItems, wantsDelivery),
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
      wantsDelivery: Boolean(cart.wantsDelivery),
      paymentMethod: isPaymentMethod(cart.paymentMethod)
        ? cart.paymentMethod
        : '',
      orderNotes:
        typeof cart.orderNotes === 'string'
          ? cart.orderNotes.trim().slice(0, MAX_ORDER_NOTES_LENGTH)
          : '',
      client: normalizeClient(cart.client),
    },
    Array.isArray(cart.items) ? cart.items : []
  );
};

const normalizePreparedCart = (cart) =>
  normalizeCart({
    items: cart?.items,
    date: cart?.date,
    purchaseOrderId: cart?.purchaseOrderId,
    purchaseOrderDate: cart?.purchaseOrderDate,
    wantsDelivery: Boolean(cart?.wantsDelivery),
  });

const isRetainedCartRecord = (record) => {
  const storedAt = Date.parse(record?.storedAt);

  return Number.isFinite(storedAt) && storedAt > Date.now() - CART_RETENTION_MS;
};

const parseStoredCartRecords = (rawValue) => {
  try {
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    const migratedStoredAt = new Date().toISOString();
    const records = Array.isArray(parsed)
      ? parsed.map((cart) => ({ storedAt: migratedStoredAt, cart }))
      : parsed?.version === 1 && Array.isArray(parsed.carts)
        ? parsed.carts.map((cart) => ({ storedAt: migratedStoredAt, cart }))
        : parsed?.version === 2 && Array.isArray(parsed.carts)
          ? parsed.carts
        : parsed?.version === CART_STORAGE_VERSION && Array.isArray(parsed.carts)
          ? parsed.carts
          : [];

    return records
      .filter(isRetainedCartRecord)
      .map(({ storedAt, cart }) => ({
        storedAt,
        cart: normalizePreparedCart(cart),
      }));
  } catch (error) {
    console.warn('Unable to read saved carts from local storage.', error);
    return [];
  }
};

const parseStoredCarts = (rawValue) =>
  parseStoredCartRecords(rawValue).map(({ cart }) => cart);

const readStoredCartRecords = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return parseStoredCartRecords(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch (error) {
    console.warn('Unable to access saved carts in local storage.', error);
    return [];
  }
};

const writeStoredCartRecords = (carts) => {
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

const migrateStoredCartHistory = () => {
  if (typeof window === 'undefined') return;

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!rawValue) return;

    const records = parseStoredCartRecords(rawValue);
    const sanitizedValue = JSON.stringify({
      version: CART_STORAGE_VERSION,
      carts: records,
    });

    if (rawValue !== sanitizedValue) {
      window.localStorage.setItem(CART_STORAGE_KEY, sanitizedValue);
      window.dispatchEvent(new CustomEvent(CART_STORAGE_EVENT));
    }
  } catch (error) {
    console.warn('Unable to migrate saved cart references.', error);
  }
};

const parseActiveCart = (rawValue) => {
  try {
    const parsed = JSON.parse(rawValue || 'null');
    const storedAt = Date.parse(parsed?.storedAt);

    if (
      parsed?.version !== ACTIVE_CART_STORAGE_VERSION ||
      !Number.isFinite(storedAt) ||
      storedAt <= Date.now() - ACTIVE_CART_RETENTION_MS
    ) {
      return createEmptyCart();
    }

    return normalizeCart({ items: parsed.cart?.items });
  } catch (error) {
    console.warn('Unable to read the active cart from browser storage.', error);
    return createEmptyCart();
  }
};

const readActiveCart = () => {
  if (typeof window === 'undefined') return createEmptyCart();
  return parseActiveCart(window.localStorage.getItem(ACTIVE_CART_STORAGE_KEY));
};

const writeActiveCart = (cart) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(
      ACTIVE_CART_STORAGE_KEY,
      JSON.stringify({
        version: ACTIVE_CART_STORAGE_VERSION,
        storedAt: new Date().toISOString(),
        cart: { items: cart.items },
      })
    );
  } catch (error) {
    console.warn('Unable to preserve the active cart in browser storage.', error);
  }
};

const cartReducer = (cart, action) => {
  switch (action.type) {
    case 'HYDRATE_ACTIVE_CART':
      return normalizeCart(action.cart);
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
          quantity: Math.min(
            MAX_ITEM_QUANTITY,
            items[itemIndex].quantity + incomingItem.quantity
          ),
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

    case 'SET_DELIVERY':
      return withItems(
        {
          ...cart,
          wantsDelivery: Boolean(action.wantsDelivery),
        },
        cart.items,
        true
      );

    case 'SET_PAYMENT_METHOD':
      return {
        ...cart,
        paymentMethod: isPaymentMethod(action.paymentMethod)
          ? action.paymentMethod
          : '',
        date: null,
        purchaseOrderId: null,
        purchaseOrderDate: null,
      };

    case 'SET_ORDER_NOTES':
      return {
        ...cart,
        orderNotes:
          typeof action.orderNotes === 'string'
            ? action.orderNotes.slice(0, MAX_ORDER_NOTES_LENGTH)
            : '',
        date: null,
        purchaseOrderId: null,
        purchaseOrderDate: null,
      };

    case 'REPLACE_ITEMS':
      return withItems(cart, action.items, true);

    case 'SELECT_CART':
      return withItems(createEmptyCart(), action.cart?.items || [], true);

    case 'FINALIZE_PURCHASE': {
      if (cart.purchaseOrderId && cart.purchaseOrderDate) {
        return action.client
          ? { ...cart, client: normalizeClient(action.client) }
          : cart;
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
  const activeCartReady = useRef(false);

  useEffect(() => {
    dispatch({ type: 'HYDRATE_ACTIVE_CART', cart: readActiveCart() });
    migrateStoredCartHistory();
    const readyTimer = window.setTimeout(() => {
      activeCartReady.current = true;
    }, 0);

    return () => window.clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (activeCartReady.current) writeActiveCart(cart);
  }, [cart]);
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

  const updateDelivery = useCallback((wantsDelivery) => {
    dispatch({ type: 'SET_DELIVERY', wantsDelivery });
  }, []);

  const updatePaymentMethod = useCallback((paymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', paymentMethod });
  }, []);

  const updateOrderNotes = useCallback((orderNotes) => {
    dispatch({ type: 'SET_ORDER_NOTES', orderNotes });
  }, []);

  const replaceCartItems = useCallback((items) => {
    dispatch({ type: 'REPLACE_ITEMS', items });
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
    const storedAt = new Date().toISOString();
    const preparedCart = normalizePreparedCart({
      items: cart.items,
      date: cart.date,
      purchaseOrderId: cart.purchaseOrderId,
      purchaseOrderDate: cart.purchaseOrderDate,
      wantsDelivery: cart.wantsDelivery,
    });
    const nextCarts = [
      ...readStoredCartRecords().filter(
        ({ cart: savedCart }) =>
          !cart.purchaseOrderId ||
          savedCart.purchaseOrderId !== cart.purchaseOrderId
      ),
      { storedAt, cart: preparedCart },
    ].slice(-MAX_SAVED_CARTS);

    if (!writeStoredCartRecords(nextCarts)) {
      return false;
    }

    return true;
  }, [cart]);

  const clearSavedCarts = useCallback(() => {
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(CART_STORAGE_EVENT));
      return true;
    } catch (error) {
      console.warn('Unable to clear saved carts from local storage.', error);
      return false;
    }
  }, []);

  const getItemsInCart = useCallback(
    (itemId) => cart.items.find((item) => item.id === itemId)?.quantity || 0,
    [cart.items]
  );

  const value = useMemo(
    () => ({
      cart,
      clearSavedCarts,
      localCarts,
      getItemsInCart,
      addItems,
      addOneItem,
      removeOneItem,
      removeAllItems,
      removeAllItemsOfAKind,
      updateCartClient,
      updateDelivery,
      updatePaymentMethod,
      updateOrderNotes,
      replaceCartItems,
      updateCurrentCart,
      finalizePurchase,
      storeCartInLocalStorage,
    }),
    [
      addItems,
      addOneItem,
      cart,
      clearSavedCarts,
      finalizePurchase,
      getItemsInCart,
      localCarts,
      removeAllItems,
      removeAllItemsOfAKind,
      removeOneItem,
      storeCartInLocalStorage,
      updateCartClient,
      updateDelivery,
      updatePaymentMethod,
      updateOrderNotes,
      replaceCartItems,
      updateCurrentCart,
    ]
  );

  return <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>;
};

export default ShoppingCartContextProvider;
export const useCartContext = () => useContext(ShoppingCartContext);
export {
  CART_STORAGE_VERSION,
  ACTIVE_CART_STORAGE_VERSION,
  CART_RETENTION_DAYS,
  DELIVERY_FEE,
  IVA_RATE,
  MAX_ITEM_QUANTITY,
  MAX_ORDER_NOTES_LENGTH,
  cartReducer,
  createEmptyCart,
  normalizeCart,
  normalizePreparedCart,
  parseActiveCart,
  parseStoredCartRecords,
  parseStoredCarts,
};
