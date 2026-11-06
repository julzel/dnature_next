import "server-only";
import { IntegrationError } from "@/lib/server/integration-error";
import { integerInRange, invalidResponse, requestIntegrationJson, requiredEnvironment, responseRecord, responseString } from "@/lib/server/integration-http";
import type { AvifyCategory, AvifyProduct, AvifyProductPage, AvifyProductQuery, AvifyVariant } from "../types/avify";

const PRODUCTS_QUERY = `query DnatureProducts($pageNum: Int, $pageSize: Int, $skus: [String], $locationId: Int, $selectMode: ProductSelectMode) {
  products(pageNum: $pageNum, pageSize: $pageSize, skus: $skus, locationId: $locationId, selectMode: $selectMode) {
    products {
      id sku name slug status type price salePrice qty description
      categories { id label parentId }
      children { id sku name status price salePrice qty }
    }
    pageSize totalCount
  }
}`;

function configuration() {
  const endpoint = requiredEnvironment("Avify", "AVIFY_GRAPHQL_URL");
  let url: URL;
  try { url = new URL(endpoint); } catch { throw new IntegrationError("Avify", "CONFIGURATION", "AVIFY_GRAPHQL_URL must be an HTTPS URL."); }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new IntegrationError("Avify", "CONFIGURATION", "AVIFY_GRAPHQL_URL must use HTTPS without credentials, a query, or a fragment.");
  }
  return { url, apiKey: requiredEnvironment("Avify", "AVIFY_API_KEY") };
}

function locationId(override: number | null | undefined): number | null {
  if (override !== undefined) return override === null ? null : integerInRange(override, 1, 2_147_483_647, "locationId");
  const configured = process.env.AVIFY_LOCATION_ID?.trim();
  if (!configured) return null;
  const value = Number(configured);
  if (!/^\d+$/.test(configured) || !Number.isInteger(value) || value < 1 || value > 2_147_483_647) {
    throw new IntegrationError("Avify", "CONFIGURATION", "AVIFY_LOCATION_ID must be a positive GraphQL integer.");
  }
  return value;
}

async function queryAvify(query: string, variables: Record<string, unknown> = {}) {
  const { url, apiKey } = configuration();
  const body = responseRecord(await requestIntegrationJson("Avify", url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({ query, variables }),
  }), "Avify", "response");
  if (body.errors !== undefined && (!Array.isArray(body.errors) || body.errors.length > 0)) {
    // GraphQL errors may accompany HTTP 200 and partial data. Never present a partial catalog as complete.
    throw new IntegrationError("Avify", "GRAPHQL", "Avify could not complete the catalog request.");
  }
  return responseRecord(body.data, "Avify", "data");
}

function identifier(value: unknown, path: string): string {
  if (typeof value === "string" && value) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return invalidResponse("Avify", path);
}

function text(value: unknown, path: string): string | null {
  return value == null ? null : responseString(value, "Avify", path);
}

function number(value: unknown, path: string): number | null {
  if (value == null) return null;
  if (typeof value !== "number" || !Number.isFinite(value)) invalidResponse("Avify", path);
  return value;
}

function variant(value: unknown, path: string): AvifyVariant {
  const item = responseRecord(value, "Avify", path);
  return {
    id: identifier(item.id, `${path}.id`),
    sku: responseString(item.sku, "Avify", `${path}.sku`),
    name: responseString(item.name, "Avify", `${path}.name`),
    status: text(item.status, `${path}.status`),
    price: number(item.price, `${path}.price`),
    salePrice: number(item.salePrice, `${path}.salePrice`),
    qty: number(item.qty, `${path}.qty`),
  };
}

function category(value: unknown, path: string): AvifyCategory {
  const item = responseRecord(value, "Avify", path);
  return { id: identifier(item.id, `${path}.id`), label: responseString(item.label, "Avify", `${path}.label`), parentId: item.parentId == null ? null : identifier(item.parentId, `${path}.parentId`) };
}

function product(value: unknown, index: number): AvifyProduct {
  const path = `products[${index}]`;
  const item = responseRecord(value, "Avify", path);
  if (item.categories != null && !Array.isArray(item.categories)) invalidResponse("Avify", `${path}.categories`);
  if (item.children != null && !Array.isArray(item.children)) invalidResponse("Avify", `${path}.children`);
  return {
    ...variant(item, path),
    slug: text(item.slug, `${path}.slug`),
    type: text(item.type, `${path}.type`),
    description: text(item.description, `${path}.description`),
    categories: ((item.categories ?? []) as unknown[]).map((value, i) => category(value, `${path}.categories[${i}]`)),
    children: ((item.children ?? []) as unknown[]).map((value, i) => variant(value, `${path}.children[${i}]`)),
  };
}

export async function checkAvifyConnection(): Promise<void> {
  const data = await queryAvify("query DnatureConnection { apiTest }");
  responseString(data.apiTest, "Avify", "apiTest");
}

export async function getAvifyProducts(options: AvifyProductQuery = {}): Promise<AvifyProductPage> {
  const page = integerInRange(options.page ?? 1, 1, 2_147_483_647, "page");
  const pageSize = integerInRange(options.pageSize ?? 24, 1, 100, "pageSize");
  if (options.skus && (options.skus.length === 0 || options.skus.length > 100 || options.skus.some((sku) => typeof sku !== "string" || !sku.trim() || sku.length > 200))) {
    throw new RangeError("skus must contain between 1 and 100 nonempty SKU strings of at most 200 characters.");
  }
  const data = await queryAvify(PRODUCTS_QUERY, {
    pageNum: page, pageSize, locationId: locationId(options.locationId), selectMode: "S",
    ...(options.skus ? { skus: [...new Set(options.skus)] } : {}),
  });
  const result = responseRecord(data.products, "Avify", "products");
  if (!Array.isArray(result.products)) invalidResponse("Avify", "products.products");
  if (!Number.isSafeInteger(result.totalCount) || (result.totalCount as number) < 0) invalidResponse("Avify", "products.totalCount");
  if (!Number.isSafeInteger(result.pageSize) || (result.pageSize as number) < 1) invalidResponse("Avify", "products.pageSize");
  return { products: result.products.map(product), page, pageSize: result.pageSize as number, totalCount: result.totalCount as number };
}
