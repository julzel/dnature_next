'use server';

import { getProducts } from '../Catalog/server';
import {
  MAX_CHECKOUT_ITEMS,
  reconcileCartItems,
} from './lib/catalog-reconciliation';

const reconcileCheckoutCartAction = async (items) => {
  try {
    const catalog = await getProducts();
    const result = reconcileCartItems(items, catalog);

    if (result.exceedsLimit) {
      return {
        ok: false,
        code: 'CART_ITEM_LIMIT_EXCEEDED',
        message: `El carrito admite hasta ${MAX_CHECKOUT_ITEMS} productos distintos. Eliminá algunos antes de continuar.`,
      };
    }

    if (!result.items.length) {
      return {
        ok: false,
        code: 'CART_EMPTY_AFTER_RECONCILIATION',
        items: [],
        message:
          'Los productos del carrito ya no están disponibles en el catálogo. Armá una selección nueva.',
      };
    }

    const changes = [
      result.removedCount
        ? `${result.removedCount} ${result.removedCount === 1 ? 'producto no disponible fue retirado' : 'productos no disponibles fueron retirados'}`
        : '',
      result.updatedPriceCount
        ? `${result.updatedPriceCount} ${result.updatedPriceCount === 1 ? 'precio cambió' : 'precios cambiaron'}`
        : '',
    ].filter(Boolean);

    return {
      ok: true,
      items: result.items,
      changed: changes.length > 0,
      message: changes.length
        ? `Actualizamos el carrito: ${changes.join(' y ')}. Revisalo antes de continuar.`
        : 'Los productos y precios coinciden con el catálogo actual.',
    };
  } catch (error) {
    console.error('Unable to reconcile checkout cart.', { name: error?.name });
    return {
      ok: false,
      code: 'CATALOG_UNAVAILABLE',
      message:
        'No pudimos comprobar los productos y precios actuales. Intentá nuevamente.',
    };
  }
};

export { reconcileCheckoutCartAction };
