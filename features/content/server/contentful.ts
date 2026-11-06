import "server-only";
import { IntegrationError } from "@/lib/server/integration-error";
import { integerInRange, invalidResponse, requestIntegrationJson, requiredEnvironment, responseRecord, responseString } from "@/lib/server/integration-http";
import type { ContentfulCollection, ContentfulContentType, ContentfulEntry, ContentfulEntryQuery, ProductContentFields } from "../types/contentful";

function id(value: string, name: string): string {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/.test(value)) throw new RangeError(`${name} contains an invalid Contentful identifier.`);
  return value;
}

function configuration() {
  const space = requiredEnvironment("Contentful", "CONTENTFUL_SPACE_ID");
  const environment = process.env.CONTENTFUL_ENVIRONMENT_ID?.trim() || "master";
  try { id(space, "CONTENTFUL_SPACE_ID"); id(environment, "CONTENTFUL_ENVIRONMENT_ID"); }
  catch { throw new IntegrationError("Contentful", "CONFIGURATION", "Contentful space and environment identifiers must be valid."); }
  return {
    base: `https://cdn.contentful.com/spaces/${space}/environments/${environment}/`,
    token: requiredEnvironment("Contentful", "CONTENTFUL_DELIVERY_API_KEY"),
    locale: process.env.CONTENTFUL_LOCALE?.trim() || "es-CR",
  };
}

function locale(value: string): string {
  if (!value || value === "*" || value.length > 50) throw new RangeError("locale must identify a single Contentful locale.");
  return value;
}

async function requestContentful(path: string, params: URLSearchParams = new URLSearchParams()) {
  const { base, token } = configuration();
  const url = new URL(path, base);
  url.search = params.toString();
  return requestIntegrationJson("Contentful", url, { headers: { Authorization: `Bearer ${token}` } });
}

function entry<Fields extends Record<string, unknown>>(value: unknown): ContentfulEntry<Fields> {
  const item = responseRecord(value, "Contentful", "entry");
  const sys = responseRecord(item.sys, "Contentful", "entry.sys");
  responseString(sys.id, "Contentful", "entry.sys.id");
  if (sys.type !== "Entry") invalidResponse("Contentful", "entry.sys.type");
  const contentType = responseRecord(sys.contentType, "Contentful", "entry.sys.contentType");
  const contentTypeSys = responseRecord(contentType.sys, "Contentful", "entry.sys.contentType.sys");
  responseString(contentTypeSys.id, "Contentful", "entry.sys.contentType.sys.id");
  responseRecord(item.fields, "Contentful", "entry.fields");
  // Custom fields are model-dependent; validate business fields in the consuming feature.
  return item as ContentfulEntry<Fields>;
}

function collection<Item>(value: unknown, parseItem: (value: unknown) => Item): ContentfulCollection<Item> {
  const body = responseRecord(value, "Contentful", "collection");
  for (const key of ["total", "skip", "limit"] as const) {
    if (!Number.isSafeInteger(body[key]) || (body[key] as number) < 0) invalidResponse("Contentful", `collection.${key}`);
  }
  if (!Array.isArray(body.items)) invalidResponse("Contentful", "collection.items");
  if (body.includes !== undefined) {
    const includes = responseRecord(body.includes, "Contentful", "collection.includes");
    for (const key of ["Entry", "Asset"]) {
      if (includes[key] !== undefined && !Array.isArray(includes[key])) invalidResponse("Contentful", `collection.includes.${key}`);
    }
  }
  return { ...body, items: body.items.map(parseItem) } as ContentfulCollection<Item>;
}

export async function getContentfulEntries<Fields extends Record<string, unknown> = Record<string, unknown>>(options: ContentfulEntryQuery): Promise<ContentfulCollection<ContentfulEntry<Fields>>> {
  const config = configuration();
  const params = new URLSearchParams({
    content_type: id(options.contentType, "contentType"),
    locale: locale(options.locale ?? config.locale),
    limit: String(integerInRange(options.limit ?? 24, 1, 1000, "limit")),
    skip: String(integerInRange(options.skip ?? 0, 0, 2_147_483_647, "skip")),
    include: String(integerInRange(options.include ?? 2, 0, 10, "include")),
    order: options.order ?? "sys.createdAt",
  });
  for (const [key, value] of Object.entries(options.filters ?? {})) {
    if (!/^fields\.[a-zA-Z0-9_]+(?:\[(?:in|nin|all|ne|exists|match|gt|gte|lt|lte)\])?$/.test(key)) throw new RangeError("Contentful filters must target a content field using a supported operator.");
    params.set(key, String(value));
  }
  return collection(await requestContentful("entries", params), entry<Fields>);
}

export async function getContentfulEntry<Fields extends Record<string, unknown> = Record<string, unknown>>(entryId: string, options: { locale?: string } = {}): Promise<ContentfulEntry<Fields> | null> {
  const params = new URLSearchParams({ locale: locale(options.locale ?? configuration().locale) });
  try { return entry<Fields>(await requestContentful(`entries/${id(entryId, "entryId")}`, params)); }
  catch (error) {
    if (error instanceof IntegrationError && error.code === "HTTP" && error.status === 404) return null;
    throw error;
  }
}

export async function getContentfulContentTypes(): Promise<ContentfulCollection<ContentfulContentType>> {
  return collection(await requestContentful("content_types", new URLSearchParams({ limit: "100" })), (value) => {
    const item = responseRecord(value, "Contentful", "contentType");
    const sys = responseRecord(item.sys, "Contentful", "contentType.sys");
    responseString(sys.id, "Contentful", "contentType.sys.id");
    responseString(item.name, "Contentful", "contentType.name");
    if (!Array.isArray(item.fields)) invalidResponse("Contentful", "contentType.fields");
    return item as ContentfulContentType;
  });
}

export async function getProductContentBySku(sku: string): Promise<ContentfulEntry<ProductContentFields> | null> {
  if (!sku.trim() || sku.length > 200) throw new RangeError("sku must be a nonempty string of at most 200 characters.");
  const result = await getContentfulEntries<ProductContentFields>({ contentType: "product", filters: { "fields.avifySku": sku }, limit: 2 });
  if (result.total > 1) throw new IntegrationError("Contentful", "INVALID_RESPONSE", "Multiple published product entries match the same Avify SKU.");
  return result.items[0] ?? null;
}
