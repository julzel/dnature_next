import 'server-only';

const DEFAULT_AVIFY_GRAPHQL_URL = 'https://api.avify.com/graphql';
const AVIFY_REQUEST_TIMEOUT_MS = 5000;
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
        name
        status
        price
        salePrice
        qty
        children {
          id
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
    price:
      typeof safeProduct.salePrice === 'number'
        ? safeProduct.salePrice
        : typeof safeProduct.price === 'number'
          ? safeProduct.price
          : null,
    quantity: typeof safeProduct.qty === 'number' ? safeProduct.qty : null,
    status: typeof safeProduct.status === 'string' ? safeProduct.status : null,
    variantCount: Array.isArray(safeProduct.children)
      ? safeProduct.children.length
      : 0,
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
      signal: AbortSignal.timeout(AVIFY_REQUEST_TIMEOUT_MS),
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

export { authenticateAvify, listAvifyProducts };
