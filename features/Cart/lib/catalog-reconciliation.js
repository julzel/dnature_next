const MAX_CHECKOUT_ITEMS = 50;

const flattenCatalog = (catalog) =>
  Object.values(catalog || {}).flatMap((category) => category.products || []);

const reconcileCartItems = (requestedItems, catalog) => {
  const sourceItems = Array.isArray(requestedItems) ? requestedItems : [];
  if (sourceItems.length > MAX_CHECKOUT_ITEMS) {
    return {
      items: [],
      removedCount: 0,
      updatedPriceCount: 0,
      exceedsLimit: true,
      requestedCount: sourceItems.length,
    };
  }

  const products = flattenCatalog(catalog);
  const byId = new Map(
    products.map((product) => [String(product.sys?.id || ''), product])
  );
  const bySku = new Map(
    products
      .filter((product) => product.avifySku)
      .map((product) => [String(product.avifySku).trim(), product])
  );
  let removedCount = 0;
  let updatedPriceCount = 0;
  let updatedQuantityCount = 0;
  let avifyUnavailable = false;

  const items = sourceItems.flatMap((item) => {
    const quantity = Number(item?.quantity);
    const catalogId = String(item?.catalogProductId || '').trim();
    const sku = String(item?.sku || '').trim();
    const product = byId.get(catalogId) || bySku.get(sku);

    if (
      !product ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      removedCount += 1;
      return [];
    }

    if (
      product.avifySku &&
      product.commerce &&
      product.commerce.mapped === false
    ) {
      if (product.commerce.integrationAvailable === false) {
        avifyUnavailable = true;
      } else {
        removedCount += 1;
      }
      return [];
    }

    const presentation = String(item?.presentation || '').trim();
    const presentationPrices = product.preciosPorUnidad || null;
    const presentationCommerce = presentationPrices
      ? product.commerce?.presentations?.[presentation] || null
      : null;
    const availability = presentationPrices
      ? presentationCommerce?.availability || 'unknown'
      : product.commerce?.availability || 'unknown';
    const availableQuantity = presentationPrices
      ? presentationCommerce?.availableQuantity
      : product.commerce?.availableQuantity;

    if (availability === 'unavailable') {
      removedCount += 1;
      return [];
    }

    const reconciledQuantity = Number.isFinite(availableQuantity)
      ? Math.min(quantity, availableQuantity)
      : quantity;

    if (reconciledQuantity < 1) {
      removedCount += 1;
      return [];
    }

    if (reconciledQuantity !== quantity) updatedQuantityCount += 1;

    const currentPrice = presentationPrices
      ? Number(presentationPrices[presentation])
      : Number(product.precio);

    if (!Number.isFinite(currentPrice) || currentPrice < 0) {
      removedCount += 1;
      return [];
    }

    if (currentPrice !== Number(item.price)) updatedPriceCount += 1;

    return [
      {
        id: presentationPrices
          ? `${product.sys.id}-${presentation}`
          : String(product.sys.id),
        catalogProductId: String(product.sys.id),
        sku:
          presentationCommerce?.variantSku ||
          product.avifySku ||
          sku ||
          undefined,
        ...(product.commerce?.mapped
          ? {
              parentSku: product.commerce.parentSku,
              avifyProductId: product.commerce.productId,
              ...(presentationCommerce?.variantId
                ? { avifyVariantId: presentationCommerce.variantId }
                : {}),
              ...(presentationCommerce?.attributes?.length
                ? { avifyAttributes: presentationCommerce.attributes }
                : {}),
            }
          : {}),
        productName: presentationPrices
          ? `${product.productName} ${presentation}`.trim()
          : product.productName,
        presentation: presentationPrices
          ? presentation
          : product.medida || presentation,
        quantity: reconciledQuantity,
        price: currentPrice,
        ...(product.images?.[0]?.url
          ? { image: product.images[0].url }
          : {}),
      },
    ];
  });

  return {
    items,
    removedCount,
    updatedPriceCount,
    ...(updatedQuantityCount ? { updatedQuantityCount } : {}),
    ...(avifyUnavailable ? { avifyUnavailable: true } : {}),
  };
};

export { MAX_CHECKOUT_ITEMS, flattenCatalog, reconcileCartItems };
