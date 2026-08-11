const normalizePresentation = (value) => {
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(',', '.')
    .replace(/[^a-z0-9.]+/g, '');
  const weight = normalized.match(/^(\d+(?:\.\d+)?)(kg|k|g)$/);

  if (weight) {
    const amount = Number(weight[1]);
    return `${weight[2] === 'g' ? amount : amount * 1000}g`;
  }

  const volume = normalized.match(/^(\d+(?:\.\d+)?)(ml|l)$/);

  if (volume) {
    const amount = Number(volume[1]);
    return `${volume[2] === 'ml' ? amount : amount * 1000}ml`;
  }

  return normalized
    .replace(/^mediana$/, 'mediano')
    .replace(/^pequena$/, 'pequeno');
};

const inventorySignal = ({ onDemand = false, quantity, reserved = 0 } = {}) => {
  if (onDemand) {
    return {
      availability: 'available',
      availableQuantity: null,
      onDemand: true,
    };
  }

  if (!Number.isFinite(quantity)) {
    return {
      availability: 'unknown',
      availableQuantity: null,
      onDemand: false,
    };
  }

  const availableQuantity = Math.max(
    0,
    Math.floor(quantity - (Number.isFinite(reserved) ? reserved : 0))
  );

  return {
    availability: availableQuantity > 0 ? 'available' : 'unavailable',
    availableQuantity,
    onDemand: false,
  };
};

const indexVariantsByPresentation = (avifyProduct) => {
  const variants = avifyProduct?.variants || [];
  const variantsBySku = new Map(
    variants.filter(({ sku }) => sku).map((variant) => [variant.sku, variant])
  );
  const candidates = new Map();

  const addCandidate = (label, variant) => {
    const key = normalizePresentation(label);
    if (!key || !variant) return;

    const existing = candidates.get(key);
    if (existing && existing.sku !== variant.sku) {
      candidates.set(key, null);
      return;
    }

    if (!candidates.has(key)) candidates.set(key, variant);
  };

  for (const variant of variants) {
    addCandidate(variant.name, variant);
    for (const attribute of variant.attributes || []) {
      addCandidate(attribute.value, variant);
    }
  }

  for (const option of avifyProduct?.variantOptions || []) {
    for (const value of option.values || []) {
      addCandidate(value.label, variantsBySku.get(value.productsSku));
    }
  }

  return candidates;
};

const fallbackCommerce = (product, integrationAvailable) => ({
  integration: 'avify',
  integrationAvailable,
  mapped: false,
  mappingMissing: Boolean(integrationAvailable && product?.avifySku),
  parentSku: product?.avifySku || null,
  productId: null,
  type: null,
  status: null,
  priceSource: 'contentful-fallback',
  availability: 'unknown',
  availableQuantity: null,
  onDemand: false,
  taxPercentage: null,
  taxPrice: null,
  presentations: {},
});

const enrichProductWithAvify = (
  product,
  avifyProduct,
  { integrationAvailable = true } = {}
) => {
  if (!avifyProduct) {
    return {
      ...product,
      commerce: fallbackCommerce(product, integrationAvailable),
    };
  }

  const baseInventory = inventorySignal(avifyProduct);
  const contentfulPresentations =
    product?.preciosPorUnidad &&
    typeof product.preciosPorUnidad === 'object' &&
    !Array.isArray(product.preciosPorUnidad)
      ? product.preciosPorUnidad
      : null;
  const variantsByPresentation = indexVariantsByPresentation(avifyProduct);
  const presentations = {};
  const effectivePresentationPrices = {};

  for (const [label, contentfulPrice] of Object.entries(
    contentfulPresentations || {}
  )) {
    const variant = variantsByPresentation.get(normalizePresentation(label));
    const variantPrice = Number(variant?.price);
    const hasAvifyPrice = variant && Number.isFinite(variantPrice);
    const availability = variant
      ? inventorySignal({
          quantity: variant.quantity,
          reserved: variant.reserved,
          onDemand: variant.onDemand,
        })
      : inventorySignal();

    effectivePresentationPrices[label] = hasAvifyPrice
      ? variantPrice
      : contentfulPrice;
    presentations[label] = {
      ...availability,
      price: hasAvifyPrice ? variantPrice : Number(contentfulPrice),
      priceSource: hasAvifyPrice ? 'avify' : 'contentful-fallback',
      variantId: variant?.id ?? null,
      variantSku: variant?.sku || null,
      attributes: variant?.attributes || [],
    };
  }

  const presentationValues = Object.values(presentations);
  const matchedPresentationCount = presentationValues.filter(
    ({ variantSku }) => variantSku
  ).length;
  const availablePresentationCount = presentationValues.filter(
    ({ availability }) => availability === 'available'
  ).length;
  const allPresentationsMatched =
    presentationValues.length > 0 &&
    matchedPresentationCount === presentationValues.length;
  const presentationAvailability = availablePresentationCount
    ? 'available'
    : allPresentationsMatched
      ? 'unavailable'
      : 'unknown';
  const useBasePrice = !contentfulPresentations && avifyProduct.type === 'simple';
  const effectiveBasePrice = useBasePrice && Number.isFinite(avifyProduct.price)
    ? avifyProduct.price
    : product.precio;
  const priceSources = new Set(
    presentationValues.map(({ priceSource }) => priceSource)
  );

  return {
    ...product,
    precio: effectiveBasePrice,
    ...(contentfulPresentations
      ? { preciosPorUnidad: effectivePresentationPrices }
      : {}),
    commerce: {
      integration: 'avify',
      integrationAvailable,
      mapped: true,
      mappingMissing: false,
      parentSku: avifyProduct.sku,
      productId: avifyProduct.id,
      type: avifyProduct.type,
      status: avifyProduct.status,
      priceSource: contentfulPresentations
        ? priceSources.size === 1 && priceSources.has('avify')
          ? 'avify'
          : 'mixed'
        : useBasePrice
          ? 'avify'
          : 'contentful-fallback',
      availability: contentfulPresentations
        ? presentationAvailability
        : useBasePrice
          ? baseInventory.availability
          : 'unknown',
      availableQuantity: useBasePrice
        ? baseInventory.availableQuantity
        : null,
      onDemand: useBasePrice ? baseInventory.onDemand : false,
      taxPercentage: avifyProduct.taxPercentage,
      taxPrice: avifyProduct.taxPrice,
      presentations,
      variantOptions: avifyProduct.variantOptions || [],
    },
  };
};

const enrichCatalogWithAvify = (
  categories,
  avifyProducts = [],
  { integrationAvailable = true } = {}
) => {
  const avifyBySku = new Map(
    avifyProducts
      .filter(({ sku }) => typeof sku === 'string' && sku.trim())
      .map((product) => [product.sku.trim(), product])
  );

  return Object.fromEntries(
    Object.entries(categories || {}).map(([categoryId, category]) => [
      categoryId,
      {
        ...category,
        products: (category.products || []).map((product) =>
          enrichProductWithAvify(
            product,
            avifyBySku.get(product.avifySku?.trim()),
            { integrationAvailable }
          )
        ),
      },
    ])
  );
};

const getPresentationCommerce = (product, presentation) =>
  product?.commerce?.presentations?.[presentation] || null;

const getCatalogAvifySkus = (categories) => [
  ...new Set(
    Object.values(categories || {})
      .flatMap((category) => category.products || [])
      .map((product) => product.avifySku?.trim())
      .filter(Boolean)
  ),
];

export {
  enrichCatalogWithAvify,
  enrichProductWithAvify,
  getCatalogAvifySkus,
  getPresentationCommerce,
  inventorySignal,
  indexVariantsByPresentation,
  normalizePresentation,
};
