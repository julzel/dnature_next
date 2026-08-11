import 'server-only';

const DEFAULT_AVIFY_GRAPHQL_URL = 'https://api.avify.com/graphql';
const AVIFY_REQUEST_TIMEOUT_MS = 5000;
const AVIFY_PRODUCT_REQUEST_TIMEOUT_MS = 10000;
const AVIFY_CATALOG_MAX_PAGES = 100;
const AVIFY_CATALOG_PAGE_RETRIES = 1;
const AVIFY_AUTHENTICATION_QUERY = `
  query AuthenticateAvify {
    apiTest
  }
`;
const AVIFY_PRODUCTS_QUERY = `
  query Products(
    $pageNum: Int
    $pageSize: Int
    $filters: Filters
    $skus: [String]
    $locationId: Int
    $selectMode: ProductSelectMode
  ) {
    products(
      pageNum: $pageNum
      pageSize: $pageSize
      filters: $filters
      skus: $skus
      locationId: $locationId
      selectMode: $selectMode
    ) {
      products {
        id
        sku
        customSku
        name
        slug
        status
        type
        price
        salePrice
        taxPrice
        taxPercentage
        qty
        reserved
        onDemand
        categories {
          id
          label
        }
        children {
          id
          sku
          customSku
          name
          status
          price
          salePrice
          qty
          reserved
          onDemand
          attributes {
            code
            value
          }
        }
        variantOptions {
          id
          attributeCode
          name
          type
          values {
            id
            label
            productsSku
          }
        }
      }
      pageSize
      totalCount
    }
  }
`;

const failure = (code, message, status = null, developmentDetails) => ({
  success: false,
  code,
  message,
  status,
  ...(process.env.NODE_ENV !== 'production' && developmentDetails
    ? { developmentDetails }
    : {}),
});

const getGraphqlErrorDetails = (errors) =>
  errors.slice(0, 3).map((error) => ({
    message:
      typeof error?.message === 'string'
        ? error.message
        : 'Error de GraphQL sin mensaje.',
    ...(typeof error?.extensions?.code === 'string'
      ? { code: error.extensions.code }
      : {}),
  }));

const getHttpsUrl = (configuredValue, defaultValue, variableName) => {
  const configuredUrl = configuredValue?.trim() || defaultValue;
  const url = new URL(configuredUrl);

  if (url.protocol !== 'https:') {
    throw new Error(`${variableName} must use HTTPS.`);
  }

  return url.toString();
};

const getGraphqlUrl = () =>
  getHttpsUrl(
    process.env.AVIFY_GRAPHQL_URL,
    DEFAULT_AVIFY_GRAPHQL_URL,
    'AVIFY_GRAPHQL_URL'
  );

const getAvifyLocationId = () => {
  const value = Number(process.env.AVIFY_LOCATION_ID);
  return Number.isInteger(value) && value > 0 ? value : null;
};

const getProductListOptions = (options) => {
  const safeOptions =
    options && typeof options === 'object' && !Array.isArray(options)
      ? options
      : {};
  const pageNum = Number.isInteger(safeOptions.pageNum)
    ? safeOptions.pageNum
    : 1;
  const pageSize = Number.isInteger(safeOptions.pageSize)
    ? safeOptions.pageSize
    : 10;
  const skus = Array.isArray(safeOptions.skus)
    ? safeOptions.skus
        .filter((sku) => typeof sku === 'string')
        .map((sku) => sku.trim())
        .filter(Boolean)
        .slice(0, 100)
    : null;

  return {
    pageNum: Math.max(1, pageNum),
    pageSize: Math.min(100, Math.max(1, pageSize)),
    filters:
      safeOptions.filters &&
      typeof safeOptions.filters === 'object' &&
      !Array.isArray(safeOptions.filters)
        ? safeOptions.filters
        : null,
    skus: skus?.length ? skus : null,
    locationId:
      Number.isInteger(safeOptions.locationId) && safeOptions.locationId > 0
      ? safeOptions.locationId
      : null,
    selectMode: 'S',
  };
};

const toProductSummary = (product) => {
  const safeProduct =
    product && typeof product === 'object' && !Array.isArray(product)
      ? product
      : {};

  return {
    id:
      typeof safeProduct.id === 'string' || typeof safeProduct.id === 'number'
        ? safeProduct.id
        : null,
    name: typeof safeProduct.name === 'string' ? safeProduct.name : null,
    sku: typeof safeProduct.sku === 'string' ? safeProduct.sku : null,
    customSku:
      typeof safeProduct.customSku === 'string' && safeProduct.customSku
        ? safeProduct.customSku
        : null,
    slug: typeof safeProduct.slug === 'string' ? safeProduct.slug : null,
    type: typeof safeProduct.type === 'string' ? safeProduct.type : null,
    price:
      typeof safeProduct.salePrice === 'number'
        ? safeProduct.salePrice
        : typeof safeProduct.price === 'number'
          ? safeProduct.price
          : null,
    taxPrice:
      typeof safeProduct.taxPrice === 'number' ? safeProduct.taxPrice : null,
    taxPercentage:
      typeof safeProduct.taxPercentage === 'number'
        ? safeProduct.taxPercentage
        : null,
    quantity: typeof safeProduct.qty === 'number' ? safeProduct.qty : null,
    reserved:
      typeof safeProduct.reserved === 'number' ? safeProduct.reserved : null,
    onDemand: safeProduct.onDemand === true,
    status: typeof safeProduct.status === 'string' ? safeProduct.status : null,
    categories: Array.isArray(safeProduct.categories)
      ? safeProduct.categories.map((category) => ({
          id:
            typeof category?.id === 'string' || typeof category?.id === 'number'
              ? category.id
              : null,
          label: typeof category?.label === 'string' ? category.label : null,
        }))
      : [],
    variantCount: Array.isArray(safeProduct.children)
      ? safeProduct.children.length
      : 0,
    variants: Array.isArray(safeProduct.children)
      ? safeProduct.children.map((variant) => ({
          id:
            typeof variant?.id === 'string' || typeof variant?.id === 'number'
              ? variant.id
              : null,
          sku: typeof variant?.sku === 'string' ? variant.sku : null,
          customSku:
            typeof variant?.customSku === 'string' && variant.customSku
              ? variant.customSku
              : null,
          name: typeof variant?.name === 'string' ? variant.name : null,
          status: typeof variant?.status === 'string' ? variant.status : null,
          price:
            typeof variant?.salePrice === 'number'
              ? variant.salePrice
              : typeof variant?.price === 'number'
                ? variant.price
                : null,
          quantity: typeof variant?.qty === 'number' ? variant.qty : null,
          reserved:
            typeof variant?.reserved === 'number' ? variant.reserved : null,
          onDemand: variant?.onDemand === true,
          attributes: Array.isArray(variant?.attributes)
            ? variant.attributes
                .filter(
                  (attribute) =>
                    typeof attribute?.code === 'string' &&
                    (typeof attribute?.value === 'string' ||
                      typeof attribute?.value === 'number')
                )
                .map((attribute) => ({
                  code: attribute.code,
                  value: String(attribute.value),
                }))
            : [],
        }))
      : [],
    variantOptions: Array.isArray(safeProduct.variantOptions)
      ? safeProduct.variantOptions.map((option) => ({
          id: option?.id ?? null,
          attributeCode:
            typeof option?.attributeCode === 'string'
              ? option.attributeCode
              : null,
          name: typeof option?.name === 'string' ? option.name : null,
          type: typeof option?.type === 'string' ? option.type : null,
          values: Array.isArray(option?.values)
            ? option.values.map((value) => ({
                id: value?.id ?? null,
                label: typeof value?.label === 'string' ? value.label : null,
                productsSku:
                  typeof value?.productsSku === 'string'
                    ? value.productsSku
                    : null,
              }))
            : [],
        }))
      : [],
  };
};

/**
 * Verifies the server-side Avify credential.
 *
 * This check does not create a user session and never returns the API key or
 * Avify's store-identifying apiTest response to the caller.
 */
const authenticateAvify = async () => {
  const apiKey = process.env.AVIFY_API_KEY?.trim();

  if (!apiKey) {
    return failure(
      'AVIFY_NOT_CONFIGURED',
      'La integración con Avify no está configurada.'
    );
  }

  let graphqlUrl;

  try {
    graphqlUrl = getGraphqlUrl();
  } catch {
    return failure(
      'AVIFY_INVALID_CONFIGURATION',
      'La configuración del servicio de Avify no es válida.'
    );
  }

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        query: AVIFY_AUTHENTICATION_QUERY,
        variables: {},
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(AVIFY_REQUEST_TIMEOUT_MS),
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      return failure(
        'AVIFY_INVALID_RESPONSE',
        'Avify devolvió una respuesta no válida.',
        response.status
      );
    }

    if (!response.ok) {
      return failure(
        'AVIFY_AUTHENTICATION_FAILED',
        'No se pudo autenticar la integración con Avify.',
        response.status
      );
    }

    if (payload?.errors?.length) {
      return failure(
        'AVIFY_GRAPHQL_ERROR',
        'Avify rechazó la consulta de autenticación.',
        response.status,
        getGraphqlErrorDetails(payload.errors)
      );
    }

    if (typeof payload?.data?.apiTest !== 'string' || !payload.data.apiTest) {
      return failure(
        'AVIFY_INVALID_RESPONSE',
        'Avify devolvió una respuesta no válida.',
        response.status
      );
    }

    return {
      success: true,
      code: 'AVIFY_AUTHENTICATED',
      message: 'La integración con Avify está autenticada.',
      status: response.status,
    };
  } catch {
    return failure(
      'AVIFY_UNAVAILABLE',
      'No se pudo conectar con Avify. Inténtalo de nuevo.'
    );
  }
};

/**
 * Lists products from Avify without exposing the server-side credential.
 */
const listAvifyProducts = async (options) => {
  const apiKey = process.env.AVIFY_API_KEY?.trim();

  if (!apiKey) {
    return failure(
      'AVIFY_NOT_CONFIGURED',
      'La integración con Avify no está configurada.'
    );
  }

  let graphqlUrl;

  try {
    graphqlUrl = getGraphqlUrl();
  } catch {
    return failure(
      'AVIFY_INVALID_CONFIGURATION',
      'La configuración del servicio de Avify no es válida.'
    );
  }

  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        query: AVIFY_PRODUCTS_QUERY,
        variables: getProductListOptions(options),
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(AVIFY_PRODUCT_REQUEST_TIMEOUT_MS),
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch {
      return failure(
        'AVIFY_PRODUCTS_INVALID_RESPONSE',
        'Avify devolvió una respuesta de productos no válida.',
        response.status
      );
    }

    if (!response.ok) {
      return failure(
        'AVIFY_PRODUCTS_REQUEST_FAILED',
        'No se pudieron consultar los productos de Avify.',
        response.status
      );
    }

    if (payload?.errors?.length) {
      return failure(
        'AVIFY_PRODUCTS_GRAPHQL_ERROR',
        'Avify rechazó la consulta de productos.',
        response.status,
        getGraphqlErrorDetails(payload.errors)
      );
    }

    const productPage = payload?.data?.products;

    if (
      !productPage ||
      !Array.isArray(productPage.products) ||
      typeof productPage.totalCount !== 'number'
    ) {
      return failure(
        'AVIFY_PRODUCTS_INVALID_RESPONSE',
        'Avify devolvió una respuesta de productos no válida.',
        response.status
      );
    }

    return {
      success: true,
      code: 'AVIFY_PRODUCTS_LOADED',
      message: 'Los productos de Avify se cargaron correctamente.',
      status: response.status,
      products: productPage.products.map(toProductSummary),
      pageSize:
        typeof productPage.pageSize === 'number'
          ? productPage.pageSize
          : productPage.products.length,
      totalCount: productPage.totalCount,
    };
  } catch {
    return failure(
      'AVIFY_PRODUCTS_UNAVAILABLE',
      'No se pudo conectar con Avify para consultar los productos.'
    );
  }
};

const listAllAvifyProducts = async () => {
  const products = [];
  const seenSkus = new Set();
  let pageNum = 1;
  let expectedTotal = null;

  while (
    (expectedTotal === null || products.length < expectedTotal) &&
    pageNum <= AVIFY_CATALOG_MAX_PAGES
  ) {
    let result = await listAvifyProducts({ pageNum, pageSize: 100 });

    for (
      let retry = 0;
      !result.success &&
      result.code === 'AVIFY_PRODUCTS_UNAVAILABLE' &&
      retry < AVIFY_CATALOG_PAGE_RETRIES;
      retry += 1
    ) {
      result = await listAvifyProducts({ pageNum, pageSize: 100 });
    }

    if (!result.success) {
      return result;
    }

    if (expectedTotal === null) {
      expectedTotal = result.totalCount;
    } else if (result.totalCount > expectedTotal) {
      expectedTotal = result.totalCount;
    }

    for (const product of result.products) {
      const sku = product.sku?.trim();
      if (!sku || seenSkus.has(sku)) continue;
      seenSkus.add(sku);
      products.push(product);
    }

    if (!result.products.length) {
      break;
    }

    pageNum += 1;
  }

  if (expectedTotal !== null && products.length < expectedTotal) {
    return failure(
      'AVIFY_CATALOG_INCOMPLETE',
      'Avify devolvió un catálogo incompleto.',
      null,
      { expectedTotal, receivedTotal: products.length }
    );
  }

  return {
    success: true,
    code: 'AVIFY_CATALOG_LOADED',
    message: 'El catálogo completo de Avify se cargó correctamente.',
    status: 200,
    products,
    totalCount: expectedTotal ?? products.length,
    variantCount: products.reduce(
      (total, product) => total + product.variantCount,
      0
    ),
  };
};

const listAvifyProductsBySkus = async (skus, { locationId } = {}) => {
  const uniqueSkus = [
    ...new Set(
      (Array.isArray(skus) ? skus : [])
        .filter((sku) => typeof sku === 'string')
        .map((sku) => sku.trim())
        .filter(Boolean)
    ),
  ];

  if (!uniqueSkus.length) {
    return {
      success: true,
      code: 'AVIFY_PRODUCTS_LOADED',
      message: 'No había productos de Avify por consultar.',
      status: 200,
      products: [],
      totalCount: 0,
      missingSkus: [],
    };
  }

  const products = [];

  for (let index = 0; index < uniqueSkus.length; index += 100) {
    const batch = uniqueSkus.slice(index, index + 100);
    const result = await listAvifyProducts({
      pageNum: 1,
      pageSize: batch.length,
      skus: batch,
      locationId:
        Number.isInteger(locationId) && locationId > 0
          ? locationId
          : getAvifyLocationId(),
    });

    if (!result.success) return result;
    products.push(...result.products);
  }

  const productsBySku = new Map(
    products
      .filter(({ sku }) => typeof sku === 'string' && sku.trim())
      .map((product) => [product.sku.trim(), product])
  );

  return {
    success: true,
    code: 'AVIFY_PRODUCTS_LOADED',
    message: 'Los productos de Avify se cargaron correctamente.',
    status: 200,
    products: [...productsBySku.values()],
    totalCount: productsBySku.size,
    missingSkus: uniqueSkus.filter((sku) => !productsBySku.has(sku)),
  };
};

export {
  authenticateAvify,
  getAvifyLocationId,
  listAllAvifyProducts,
  listAvifyProducts,
  listAvifyProductsBySkus,
};
