import assert from 'node:assert/strict';
import test from 'node:test';
import { cloneCartWithCurrentPrices } from '../util/clone-cart.js';

const savedCart = () => ({
  date: '2020-01-01',
  items: [
    { id: 'plain', productName: 'Plain', quantity: 2, price: 10 },
    { id: 'sized-product-1kg', productName: 'Sized 1kg', quantity: 3, price: 20 },
  ],
  client: { address: { direccion: 'Saved address' } },
  totalItems: 99,
  subtotal: 80,
  tax: 0,
  discount: 0,
  total: 80,
});

const products = [
  { sys: { id: 'plain' }, precio: 15 },
  { sys: { id: 'sized-product' }, precio: 999, preciosPorUnidad: { '1kg': '25', '2kg': 45 } },
];

test('cloning refreshes base and presentation prices and recalculates totals', () => {
  const original = savedCart();
  const clone = cloneCartWithCurrentPrices(original, products);
  assert.deepEqual(clone.items.map(item => item.price), [15, 25]);
  assert.equal(clone.totalItems, 5);
  assert.equal(clone.subtotal, 105);
  assert.equal(clone.total, 105);
  assert.ok(clone.date instanceof Date);
  clone.items[0].quantity++;
  clone.client.address.direccion = 'Changed';
  assert.deepEqual(original, savedCart());
});

test('missing products or removed presentations prevent restoring stale prices', () => {
  assert.throws(() => cloneCartWithCurrentPrices(savedCart(), products.slice(1)));
  assert.throws(() => cloneCartWithCurrentPrices(savedCart(), [
    products[0], { ...products[1], preciosPorUnidad: { '2kg': 45 } },
  ]));
});

test('invalid prices fail while a valid zero price is retained', () => {
  for (const precio of [null, undefined, '', ' ', 'invalid', -1]) {
    assert.throws(() => cloneCartWithCurrentPrices(savedCart(), [
      { ...products[0], precio }, products[1],
    ]));
  }
  const clone = cloneCartWithCurrentPrices(savedCart(), [
    { ...products[0], precio: 0 }, products[1],
  ]);
  assert.equal(clone.total, 75);
});
