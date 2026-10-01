// Match the same IDs used by the catalog, including presentation suffixes.
export const cloneCartWithCurrentPrices = (cart, products) => {
  const prices = new Map();
  for (const product of products) {
    if (product.preciosPorUnidad) {
      for (const [size, price] of Object.entries(product.preciosPorUnidad)) {
        prices.set(`${product.sys.id}-${size}`, price);
      }
    } else {
      prices.set(product.sys.id, product.precio);
    }
  }

  const clone = structuredClone(cart);
  clone.items = clone.items.map((item) => {
    const value = prices.get(item.id);
    const price = typeof value === 'number' ||
      (typeof value === 'string' && value.trim() !== '')
      ? Number(value)
      : NaN;
    if (!Number.isFinite(price) || price < 0) {
      throw new Error(
        `No hay un precio disponible para ${item.productName}. Revisa el catálogo antes de repetir esta orden.`
      );
    }
    return { ...item, price };
  });
  clone.date = new Date();
  clone.totalItems = clone.items.reduce((total, item) => total + item.quantity, 0);
  clone.subtotal = clone.items.reduce(
    (total, item) => total + item.price * item.quantity, 0
  );
  clone.tax = 0;
  clone.discount = 0;
  clone.total = clone.subtotal;
  return clone;
};
