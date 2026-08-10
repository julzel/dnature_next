import { describe, expect, it, vi } from 'vitest';

import {
  ACTIVE_CART_STORAGE_VERSION,
  CART_RETENTION_DAYS,
  CART_STORAGE_VERSION,
  cartReducer,
  createEmptyCart,
  normalizeCart,
  parseActiveCart,
  parseStoredCarts,
} from '../../features/Cart/model/shopping-cart-context';

const item = {
  id: 'product-1',
  productName: 'Receta',
  price: 2500,
  quantity: 1,
};

describe('cart reducer', () => {
  it('handles rapid adds without mutating prior state', () => {
    const initial = createEmptyCart();
    const afterFirstAdd = cartReducer(initial, { type: 'ADD_ITEM', item });
    const afterThreeAdds = [
      { type: 'ADD_ITEM', item },
      { type: 'ADD_ITEM', item },
    ].reduce(cartReducer, afterFirstAdd);

    expect(initial.items).toEqual([]);
    expect(afterFirstAdd.items[0]).not.toBe(afterThreeAdds.items[0]);
    expect(afterThreeAdds).toMatchObject({
      totalItems: 3,
      subtotal: 7500,
      tax: 975,
      deliveryFee: 0,
      total: 8475,
    });
    expect(afterThreeAdds.items).toEqual([{ ...item, quantity: 3 }]);
  });

  it('adds the optional delivery fee without taxing it twice', () => {
    const cart = cartReducer(createEmptyCart(), {
      type: 'ADD_ITEM',
      item: { ...item, quantity: 3 },
    });
    const withDelivery = cartReducer(cart, {
      type: 'SET_DELIVERY',
      wantsDelivery: true,
    });
    const withoutDelivery = cartReducer(withDelivery, {
      type: 'SET_DELIVERY',
      wantsDelivery: false,
    });

    expect(withDelivery).toMatchObject({
      subtotal: 7500,
      tax: 975,
      wantsDelivery: true,
      deliveryFee: 3000,
      total: 11475,
    });
    expect(withoutDelivery).toMatchObject({
      wantsDelivery: false,
      deliveryFee: 0,
      total: 8475,
    });
  });

  it('decrements, removes one kind, and empties the cart', () => {
    const withTwo = cartReducer(createEmptyCart(), {
      type: 'ADD_ITEM',
      item: { ...item, quantity: 2 },
    });
    const withOne = cartReducer(withTwo, {
      type: 'REMOVE_ONE',
      itemId: item.id,
    });
    const removed = cartReducer(withOne, {
      type: 'REMOVE_ALL_OF_KIND',
      itemId: item.id,
    });

    expect(withOne.items[0].quantity).toBe(1);
    expect(removed.items).toEqual([]);
    expect(cartReducer(withTwo, { type: 'REMOVE_ALL' })).toEqual(
      createEmptyCart()
    );
  });

  it('uses the stable order identity supplied by the checkout event', () => {
    const action = {
      type: 'FINALIZE_PURCHASE',
      purchaseOrderId: 'DN-order-1',
      timestamp: '2026-07-18T12:00:00.000Z',
    };
    const finalized = cartReducer(createEmptyCart(), action);
    const rerendered = cartReducer(finalized, {
      ...action,
      purchaseOrderId: 'DN-order-2',
      timestamp: '2026-07-19T12:00:00.000Z',
    });

    expect(rerendered).toBe(finalized);
    expect(finalized).toMatchObject({
      date: action.timestamp,
      purchaseOrderDate: action.timestamp,
      purchaseOrderId: action.purchaseOrderId,
    });
  });
});

describe('cart storage schema', () => {
  it('preserves guest items across authentication without persisting customer details', () => {
    const parsed = parseActiveCart(
      JSON.stringify({
        version: ACTIVE_CART_STORAGE_VERSION,
        storedAt: new Date().toISOString(),
        cart: {
          items: [
            {
              ...item,
              sku: 'SKU-1',
              catalogProductId: 'contentful-product-1',
            },
          ],
          client: {
            firstName: 'No debe restaurarse',
            email: 'private@example.com',
          },
        },
      })
    );

    expect(parsed.items[0]).toMatchObject({
      sku: 'SKU-1',
      catalogProductId: 'contentful-product-1',
    });
    expect(parsed.client).toEqual(createEmptyCart().client);
  });

  it('migrates the legacy array and recalculates trusted totals', () => {
    const parsed = parseStoredCarts(
      JSON.stringify([
        {
          items: [item],
          total: 999999,
          client: { address: { provincia: 'San José' } },
        },
      ])
    );

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toMatchObject({
      subtotal: 2500,
      tax: 325,
      deliveryFee: 0,
      total: 2825,
    });
    expect(parsed[0].client.address).toEqual({
      direccion: '',
      provincia: 'San José',
      canton: '',
    });
  });

  it('accepts non-expired current records and rejects unknown or malformed schemas', () => {
    expect(
      parseStoredCarts(
        JSON.stringify({
          version: CART_STORAGE_VERSION,
          carts: [{ storedAt: new Date().toISOString(), cart: { items: [item] } }],
        })
      )
    ).toHaveLength(1);
    expect(
      parseStoredCarts(JSON.stringify({ version: CART_STORAGE_VERSION + 1, carts: [{}] }))
    ).toEqual([]);

    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(parseStoredCarts('{bad json')).toEqual([]);
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });

  it('drops invalid stored items', () => {
    expect(
      normalizeCart({
        items: [
          item,
          { ...item, id: 'bad-quantity', quantity: 0 },
          { ...item, id: 'bad-price', price: Number.NaN },
        ],
      }).items
    ).toEqual([item]);
  });

  it('expires saved cart records after the retention period', () => {
    const expiredAt = new Date(
      Date.now() - (CART_RETENTION_DAYS + 1) * 24 * 60 * 60 * 1000
    ).toISOString();

    expect(
      parseStoredCarts(
        JSON.stringify({
          version: CART_STORAGE_VERSION,
          carts: [{ storedAt: expiredAt, cart: { items: [item] } }],
        })
      )
    ).toEqual([]);
  });
});
