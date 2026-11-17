import type { SalesCatalog, SalesBucket, SalesDataset, SalesOrder, SalesProduct } from "../types/sales";

const costaRicaDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Costa_Rica", year: "numeric", month: "2-digit", day: "2-digit",
});

export function localDate(date: Date): string {
  const parts = Object.fromEntries(costaRicaDate.formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function sixMonthsBefore(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const monthIndex = year * 12 + month - 1 - 6;
  const targetYear = Math.floor(monthIndex / 12);
  const targetMonth = monthIndex - targetYear * 12 + 1;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  return `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(Math.min(day, lastDay)).padStart(2, "0")}`;
}

export function summarizeSales(orders: readonly SalesOrder[], catalog: SalesCatalog, fromDate: string, today: string, fetchedAt: string): SalesDataset {
  const catalogBySku = new Map<string, SalesProduct>();
  for (const product of catalog) {
    const info = { sku: product.sku, customSku: null, name: product.name, categories: product.categories };
    catalogBySku.set(product.sku, info);
    for (const child of product.children) catalogBySku.set(child.sku, {
      ...info, sku: child.sku,
      name: child.name && child.name !== product.name ? `${product.name} · ${child.name}` : product.name,
    });
  }

  const buckets = new Map<string, SalesBucket>();
  const products = new Map<string, SalesProduct>();
  const unmatched = new Set<string>();
  const seenOrders = new Set<string>();
  let eligibleOrders = 0;

  for (const order of orders) {
    if (seenOrders.has(order.id)) continue;
    seenOrders.add(order.id);
    const date = localDate(new Date(order.created));
    if (date < fromDate || date > today || !["complete", "processing"].includes(order.status.toLowerCase())) continue;
    eligibleOrders++;
    const seenProducts = new Set<string>();
    for (const line of order.products) {
      if (line.ordered <= 0) continue;
      const catalogProduct = catalogBySku.get(line.sku);
      if (!catalogProduct) unmatched.add(line.sku);
      const known = products.get(line.sku);
      if (!known) products.set(line.sku, { ...(catalogProduct ?? { sku: line.sku, name: line.name, categories: [] }), customSku: line.customSku });
      else if (!known.customSku && line.customSku) known.customSku = line.customSku;
      const key = JSON.stringify([line.sku, date, order.channel, order.currency]);
      const bucket = buckets.get(key) ?? { sku: line.sku, date, channel: order.channel, currency: order.currency, units: 0, orders: 0, gross: 0 };
      bucket.units += line.ordered;
      bucket.gross += line.price * line.ordered;
      if (!seenProducts.has(line.sku)) bucket.orders++;
      seenProducts.add(line.sku);
      buckets.set(key, bucket);
    }
  }

  return {
    fromDate, today, fetchedAt, scannedOrders: seenOrders.size, eligibleOrders,
    unmatchedProducts: unmatched.size, products: [...products.values()], buckets: [...buckets.values()],
  };
}
