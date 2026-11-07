import assert from "node:assert/strict";
import { test } from "node:test";
import { visibleSales, type SalesFilters } from "../../lib/filter-sales";
import type { SalesDataset } from "../../types/sales";

const dataset: SalesDataset = {
  fromDate: "2026-05-06", today: "2026-11-06", fetchedAt: "2026-11-06T18:00:00Z", scannedOrders: 3, eligibleOrders: 3, unmatchedProducts: 1,
  products: [
    { sku: "a", customSku: "DN-RES", name: "Proteína de res", categories: [{ id: "1", label: "Proteínas", parentId: null }] },
    { sku: "b", customSku: null, name: "Suplemento", categories: [{ id: "2", label: "Suplementos", parentId: null }] },
    { sku: "c", customSku: null, name: "Sin ficha", categories: [] },
  ],
  buckets: [
    { sku: "a", date: "2026-11-06", channel: "web", currency: "CRC", units: 3, orders: 2, gross: 300 },
    { sku: "a", date: "2026-06-01", channel: "web", currency: "CRC", units: 10, orders: 5, gross: 1000 },
    { sku: "a", date: "2026-11-06", channel: "pos", currency: "USD", units: 2, orders: 1, gross: 20 },
    { sku: "b", date: "2026-11-01", channel: "pos", currency: "CRC", units: 4, orders: 2, gross: 800 },
    { sku: "c", date: "2026-11-02", channel: "web", currency: "CRC", units: 1, orders: 1, gross: 50 },
  ],
};
const defaults: SalesFilters = { period: "6m", search: "", category: "", channel: "", currency: "CRC", sort: "units" };

test("filters periods, categories, channels and currencies before ranking", () => {
  assert.deepEqual(visibleSales(dataset, defaults).rows.map((row) => row.sku), ["a", "b", "c"]);
  assert.equal(visibleSales(dataset, { ...defaults, period: "30" }).rows[0].units, 4);
  assert.deepEqual(visibleSales(dataset, { ...defaults, category: "1" }).rows.map((row) => row.sku), ["a"]);
  assert.deepEqual(visibleSales(dataset, { ...defaults, channel: "pos" }).rows.map((row) => row.sku), ["b"]);
  assert.deepEqual(visibleSales(dataset, { ...defaults, category: "uncategorized" }).rows.map((row) => row.sku), ["c"]);
  assert.deepEqual(visibleSales(dataset, { ...defaults, currency: "USD" }).rows.map((row) => row.sku), ["a"]);
});

test("search is accent-insensitive and sorting uses the selected metric", () => {
  assert.deepEqual(visibleSales(dataset, { ...defaults, search: "proteina" }).rows.map((row) => row.sku), ["a"]);
  assert.deepEqual(visibleSales(dataset, { ...defaults, search: "DN-RES" }).rows.map((row) => row.sku), ["a"]);
  assert.deepEqual(visibleSales(dataset, { ...defaults, sort: "gross" }).rows.map((row) => row.sku), ["a", "b", "c"]);
  assert.deepEqual(visibleSales(dataset, { ...defaults, sort: "name" }).rows.map((row) => row.sku), ["a", "c", "b"]);
  assert.equal(visibleSales(dataset, { ...defaults, search: "inexistente" }).products, 0);
});
