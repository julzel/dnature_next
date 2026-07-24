import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  authenticateAvify,
  listAllAvifyProducts,
  listAvifyProducts,
} from '../../services/avify';

const originalApiKey = process.env.AVIFY_API_KEY;
const originalGraphqlUrl = process.env.AVIFY_GRAPHQL_URL;

const jsonResponse = (payload, { ok = true, status = 200 } = {}) => ({
  ok,
  status,
  json: vi.fn().mockResolvedValue(payload),
});

describe('Avify server-only service', () => {
  beforeEach(() => {
    process.env.AVIFY_API_KEY = 'server-secret';
    delete process.env.AVIFY_GRAPHQL_URL;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();

    if (originalApiKey === undefined) {
      delete process.env.AVIFY_API_KEY;
    } else {
      process.env.AVIFY_API_KEY = originalApiKey;
    }

    if (originalGraphqlUrl === undefined) {
      delete process.env.AVIFY_GRAPHQL_URL;
    } else {
      process.env.AVIFY_GRAPHQL_URL = originalGraphqlUrl;
    }

  });

  it('authenticates with the server-side API key', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse({
        data: {
          apiTest: 'API is working! Store: Private store details',
        },
      })
    );

    await expect(authenticateAvify()).resolves.toEqual({
      success: true,
      code: 'AVIFY_AUTHENTICATED',
      message: 'La integración con Avify está autenticada.',
      status: 200,
    });

    expect(global.fetch).toHaveBeenCalledOnce();

    const [url, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe('https://api.avify.com/graphql');
    expect(options).toMatchObject({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': 'server-secret',
      },
      cache: 'no-store',
    });
    expect(options.signal).toBeInstanceOf(AbortSignal);
    expect(body.query).toContain('apiTest');
    expect(body.variables).toEqual({});
  });

  it('fails without exposing or requesting a missing API key', async () => {
    delete process.env.AVIFY_API_KEY;

    await expect(authenticateAvify()).resolves.toEqual({
      success: false,
      code: 'AVIFY_NOT_CONFIGURED',
      message: 'La integración con Avify no está configurada.',
      status: null,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns a safe authentication failure for HTTP errors', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse(
        {
          errors: [{ message: 'Sensitive vendor response' }],
        },
        { ok: false, status: 401 }
      )
    );

    await expect(authenticateAvify()).resolves.toEqual({
      success: false,
      code: 'AVIFY_AUTHENTICATION_FAILED',
      message: 'No se pudo autenticar la integración con Avify.',
      status: 401,
    });
  });

  it('includes GraphQL diagnostics outside production', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse({
        errors: [
          {
            message: 'Cannot query field "apiTest".',
            extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
          },
        ],
      })
    );

    await expect(authenticateAvify()).resolves.toEqual({
      success: false,
      code: 'AVIFY_GRAPHQL_ERROR',
      message: 'Avify rechazó la consulta de autenticación.',
      status: 200,
      developmentDetails: [
        {
          message: 'Cannot query field "apiTest".',
          code: 'GRAPHQL_VALIDATION_FAILED',
        },
      ],
    });
  });

  it('rejects a non-HTTPS endpoint before making a request', async () => {
    process.env.AVIFY_GRAPHQL_URL = 'http://example.test/graphql';

    await expect(authenticateAvify()).resolves.toEqual({
      success: false,
      code: 'AVIFY_INVALID_CONFIGURATION',
      message: 'La configuración del servicio de Avify no es válida.',
      status: null,
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns a safe unavailable result when the request fails', async () => {
    global.fetch.mockRejectedValue(new Error('network failed'));

    await expect(authenticateAvify()).resolves.toEqual({
      success: false,
      code: 'AVIFY_UNAVAILABLE',
      message: 'No se pudo conectar con Avify. Inténtalo de nuevo.',
      status: null,
    });
  });

  it('lists a page of products with server-side credentials', async () => {
    const vendorProducts = [
      {
        id: 42,
        sku: 'DOG-FOOD-01',
        customSku: 'DOG-01',
        name: 'Alimento natural',
        slug: 'alimento-natural',
        type: 'configurable',
        price: 25,
        salePrice: 20,
        qty: 8,
        status: 'ENABLED',
        categories: [{ id: 5, label: 'Recetas' }],
        children: [
          {
            id: 43,
            sku: 'DOG-FOOD-01-500G',
            customSku: 'DOG-01-500',
            name: '500g',
            status: 'active',
            price: 12,
            salePrice: 10,
            qty: 4,
          },
        ],
        cost: 12,
        description: 'Vendor-only field',
      },
    ];
    const products = [
      {
        id: 42,
        sku: 'DOG-FOOD-01',
        customSku: 'DOG-01',
        slug: 'alimento-natural',
        type: 'configurable',
        name: 'Alimento natural',
        price: 20,
        quantity: 8,
        status: 'ENABLED',
        categories: [{ id: 5, label: 'Recetas' }],
        variantCount: 1,
        variants: [
          {
            id: 43,
            sku: 'DOG-FOOD-01-500G',
            customSku: 'DOG-01-500',
            name: '500g',
            status: 'active',
            price: 10,
            quantity: 4,
          },
        ],
      },
    ];

    global.fetch.mockResolvedValue(
      jsonResponse({
        data: {
          products: {
            products: vendorProducts,
            pageSize: 10,
            totalCount: 1,
          },
        },
      })
    );

    await expect(
      listAvifyProducts({ pageNum: 1, pageSize: 10 })
    ).resolves.toEqual({
      success: true,
      code: 'AVIFY_PRODUCTS_LOADED',
      message: 'Los productos de Avify se cargaron correctamente.',
      status: 200,
      products,
      pageSize: 10,
      totalCount: 1,
    });

    const [url, options] = global.fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(url).toBe('https://api.avify.com/graphql');
    expect(options).toMatchObject({
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'api-key': 'server-secret',
      },
      cache: 'no-store',
    });
    expect(body.query).toContain('query Products');
    expect(body.query).not.toContain('cost');
    expect(body.query).not.toContain('description');
    expect(body.variables).toEqual({
      pageNum: 1,
      pageSize: 10,
      filters: null,
      skus: null,
      locationId: null,
      selectMode: 'S',
    });
  });

  it('loads every Avify product page for reconciliation', async () => {
    const page = (id, totalCount) =>
      jsonResponse({
        data: {
          products: {
            products: [
              {
                id,
                sku: `SKU-${id}`,
                name: `Product ${id}`,
                price: 10,
                qty: 1,
                status: 'inactive',
                children: [],
              },
            ],
            pageSize: 100,
            totalCount,
          },
        },
      });

    global.fetch
      .mockResolvedValueOnce(page(1, 2))
      .mockResolvedValueOnce(page(2, 2));

    const result = await listAllAvifyProducts();

    expect(result).toMatchObject({
      success: true,
      code: 'AVIFY_CATALOG_LOADED',
      totalCount: 2,
      variantCount: 0,
    });
    expect(result.products).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(
      JSON.parse(global.fetch.mock.calls[0][1].body).variables.pageNum
    ).toBe(1);
    expect(
      JSON.parse(global.fetch.mock.calls[1][1].body).variables.pageNum
    ).toBe(2);
  });

  it('retries a transient catalog-page connection failure once', async () => {
    global.fetch
      .mockRejectedValueOnce(new Error('temporary network failure'))
      .mockResolvedValueOnce(
        jsonResponse({
          data: {
            products: {
              products: [],
              pageSize: 100,
              totalCount: 0,
            },
          },
        })
      );

    await expect(listAllAvifyProducts()).resolves.toMatchObject({
      success: true,
      code: 'AVIFY_CATALOG_LOADED',
      totalCount: 0,
    });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('normalizes product-list options before sending them to Avify', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse({
        data: {
          products: {
            products: [],
            pageSize: 100,
            totalCount: 0,
          },
        },
      })
    );

    await listAvifyProducts({
      pageNum: -2,
      pageSize: 500,
      filters: [],
      skus: [' VALID-SKU ', '', 42, 'SECOND-SKU'],
      locationId: -4,
      selectMode: 'UNTRUSTED',
    });

    const body = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(body.variables).toEqual({
      pageNum: 1,
      pageSize: 100,
      filters: null,
      skus: ['VALID-SKU', 'SECOND-SKU'],
      locationId: null,
      selectMode: 'S',
    });
  });

  it('handles a non-JSON product response safely', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 502,
      json: vi.fn().mockRejectedValue(new SyntaxError('Invalid JSON')),
    });

    await expect(listAvifyProducts()).resolves.toEqual({
      success: false,
      code: 'AVIFY_PRODUCTS_INVALID_RESPONSE',
      message: 'Avify devolvió una respuesta de productos no válida.',
      status: 502,
    });
  });

  it('returns safe GraphQL details when the product query is rejected', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse({
        errors: [
          {
            message: 'Unknown product field.',
            extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
          },
        ],
      })
    );

    await expect(listAvifyProducts()).resolves.toEqual({
      success: false,
      code: 'AVIFY_PRODUCTS_GRAPHQL_ERROR',
      message: 'Avify rechazó la consulta de productos.',
      status: 200,
      developmentDetails: [
        {
          message: 'Unknown product field.',
          code: 'GRAPHQL_VALIDATION_FAILED',
        },
      ],
    });
  });

  it('rejects an invalid product response shape', async () => {
    global.fetch.mockResolvedValue(
      jsonResponse({
        data: {
          products: null,
        },
      })
    );

    await expect(listAvifyProducts()).resolves.toEqual({
      success: false,
      code: 'AVIFY_PRODUCTS_INVALID_RESPONSE',
      message: 'Avify devolvió una respuesta de productos no válida.',
      status: 200,
    });
  });

  it('suppresses vendor diagnostics in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    global.fetch.mockResolvedValue(
      jsonResponse({
        errors: [{ message: 'Sensitive vendor diagnostic' }],
      })
    );

    await expect(listAvifyProducts()).resolves.toEqual({
      success: false,
      code: 'AVIFY_PRODUCTS_GRAPHQL_ERROR',
      message: 'Avify rechazó la consulta de productos.',
      status: 200,
    });

  });
});
