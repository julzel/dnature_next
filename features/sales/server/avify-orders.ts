import "server-only";
import { getAvifyProducts } from "@/features/catalog/server/avify";
import { queryAvify } from "@/lib/server/avify-client";
import { IntegrationError } from "@/lib/server/integration-error";
import { invalidResponse, responseRecord, responseString } from "@/lib/server/integration-http";
import { localDate, sixMonthsBefore, summarizeSales } from "../lib/summarize-sales";
import type { SalesCatalog, SalesDataset, SalesOrder, SalesOrderLine } from "../types/sales";

const PAGE_SIZE = 100;
const REQUEST_GAP_MS = 750;
const ORDERS_QUERY = `query DnatureSalesOrders($pageNum: Int!) {
  orders(pageNum: $pageNum, pageSize: 100, version: "2", timeZone: "America/Costa_Rica") {
    totalCount pagesLeft
    orders {
      id created status channel
      costs { orderCurrencyCode }
      products { sku customSku name ordered price }
    }
  }
}`;

function numeric(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) invalidResponse("Avify", path);
  return value as number;
}

function line(value: unknown, path: string): SalesOrderLine {
  const item = responseRecord(value, "Avify", path);
  return {
    sku: responseString(item.sku, "Avify", `${path}.sku`),
    customSku: item.customSku == null ? null : responseString(item.customSku, "Avify", `${path}.customSku`),
    name: responseString(item.name, "Avify", `${path}.name`),
    ordered: numeric(item.ordered, `${path}.ordered`),
    price: numeric(item.price, `${path}.price`),
  };
}

function order(value: unknown, index: number): SalesOrder {
  const path = `orders[${index}]`;
  const item = responseRecord(value, "Avify", path);
  const costs = responseRecord(item.costs, "Avify", `${path}.costs`);
  const created = responseString(item.created, "Avify", `${path}.created`);
  if (!Number.isFinite(Date.parse(created))) invalidResponse("Avify", `${path}.created`);
  if (!Array.isArray(item.products)) invalidResponse("Avify", `${path}.products`);
  return {
    id: responseString(item.id, "Avify", `${path}.id`),
    created,
    status: responseString(item.status, "Avify", `${path}.status`),
    channel: responseString(item.channel, "Avify", `${path}.channel`),
    currency: responseString(costs.orderCurrencyCode, "Avify", `${path}.costs.orderCurrencyCode`),
    products: item.products.map((product, lineIndex) => line(product, `${path}.products[${lineIndex}]`)),
  };
}

async function getOrderPage(pageNum: number): Promise<{ orders: SalesOrder[]; totalCount: number; pagesLeft: number }> {
  const data = await retryRateLimit(() => queryAvify(ORDERS_QUERY, { pageNum }));
  const result = responseRecord(data.orders, "Avify", "orders");
  if (!Array.isArray(result.orders)) invalidResponse("Avify", "orders.orders");
  const totalCount = numeric(result.totalCount, "orders.totalCount");
  const pagesLeft = numeric(result.pagesLeft, "orders.pagesLeft");
  if (!Number.isSafeInteger(totalCount) || !Number.isSafeInteger(pagesLeft)) invalidResponse("Avify", "orders.pagination");
  return { orders: result.orders.map(order), totalCount, pagesLeft };
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function retryRateLimit<T>(request: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await request(); }
    catch (error) {
      if (!(error instanceof IntegrationError) || error.status !== 429 || attempt >= 3) throw error;
      await wait(error.retryAfterSeconds !== undefined ? Math.max(1000, error.retryAfterSeconds * 1000) : 60_000);
    }
  }
}

async function getCatalog(): Promise<SalesCatalog> {
  const first = await retryRateLimit(() => getAvifyProducts({ page: 1, pageSize: PAGE_SIZE, locationId: null }));
  const count = Math.ceil(first.totalCount / PAGE_SIZE);
  const products = [...first.products];
  for (let page = 2; page <= count; page++) {
    await wait(REQUEST_GAP_MS);
    products.push(...(await retryRateLimit(() => getAvifyProducts({ page, pageSize: PAGE_SIZE, locationId: null }))).products);
  }
  return products;
}

export async function getAvifyOrdersSince(fromDate: string): Promise<SalesOrder[]> {
  const first = await getOrderPage(1);
  const orders = [...first.orders];
  const totalPages = Math.max(1, Math.ceil(first.totalCount / PAGE_SIZE));
  let nextPage = 2;
  let descending = true;
  while (true) {
    for (let index = 1; index < orders.length; index++) {
      if (orders[index].created > orders[index - 1].created) descending = false;
    }
    if (descending && orders.length > 0 && localDate(new Date(orders.at(-1)!.created)) < fromDate) break;
    if (nextPage > totalPages) break;
    await wait(REQUEST_GAP_MS);
    const page = await getOrderPage(nextPage);
    orders.push(...page.orders);
    nextPage++;
  }
  return orders;
}

export async function getAvifySalesDataset(now = new Date()): Promise<SalesDataset> {
  const today = localDate(now);
  const fromDate = sixMonthsBefore(today);
  const orders = await getAvifyOrdersSince(fromDate);
  const catalog = await getCatalog();
  return summarizeSales(orders, catalog, fromDate, today, now.toISOString());
}
