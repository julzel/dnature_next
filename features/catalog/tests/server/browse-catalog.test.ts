import assert from "node:assert/strict";
import { test } from "node:test";
import type { SalesBucket } from "@/features/sales/types/sales";
import { browseCatalog, CATALOG_SHELF_SIZE, prepareCatalog } from "../../lib/browse-catalog";
import type { CatalogProduct } from "../../types/catalog";

function product(sku: string, name: string, category: string, qty = 2): CatalogProduct {
  return {
    sku,
    commerce: {
      id: sku, sku, name, status: "inactive", price: 2500, salePrice: null, qty,
      slug: null, type: "simple", description: null,
      categories: [{ id: category, label: category, parentId: null }], children: [],
    },
    editorial: {
      id: `entry-${sku}`, fields: { avifySku: sku, productName: name },
      images: [{ sys: { id: `image-${sku}`, type: "Asset" }, fields: { file: { url: `//images.ctfassets.net/space/${sku}.jpg`, fileName: `${sku}.jpg`, contentType: "image/jpeg" } } }],
    },
  };
}

function sales(sku: string, units: number): SalesBucket {
  return { sku, units, orders: 1, gross: units * 2500, date: "2026-11-07", channel: "web", currency: "CRC" };
}

test("prepares catalog previews with images, availability, and aggregated variant sales", () => {
  const parent = product("parent", "Pulmón", "Snacks deshidratados", 0);
  parent.commerce.children = [{ id: "v", sku: "v", name: "Pequeño", status: "active", price: 3000, salePrice: null, qty: 3 }];
  const { categories, listings } = prepareCatalog([parent, product("sold-out", "Agotado", "Snacks deshidratados", 0)], [sales("parent", 2), sales("v", 8)]);
  assert.equal(categories.length, 1);
  assert.deepEqual(listings.map((item) => item.sku), ["parent", "sold-out"]);
  assert.equal(listings[0].unitsSold, 10);
  assert.equal(listings[0].offer.price, 3000);
  assert.equal(listings[0].imageUrl, "https://images.ctfassets.net/space/parent.jpg");
  assert.equal(listings[1].offer.inStock, false);
});

test("shows five products per category in sales order, including sold-out favorites", () => {
  const products = [product("sold-out", "Agotado", "Proteínas", 0), ...Array.from({ length: 7 }, (_, index) => product(`p${index}`, `Producto ${index}`, "Proteínas"))];
  const buckets = [sales("sold-out", 100), ...products.slice(1).map((item, index) => sales(item.sku, index + 1))];
  const { categories, listings } = prepareCatalog(products, buckets);
  const view = browseCatalog(listings, categories, {});
  assert.equal(view.shelves.length, 1);
  assert.equal(view.shelves[0].products.length, CATALOG_SHELF_SIZE);
  assert.deepEqual(view.shelves[0].products.map((item) => item.sku), ["sold-out", "p6", "p5", "p4", "p3"]);
});

test("groups categories and filters names or SKUs without accents", () => {
  const { categories, listings } = prepareCatalog([
    product("pulmon", "Pulmón grande", "Snacks deshidratados"),
    product("other", "Pulmón pequeño", "Snacks deshidratados"),
    product("mix", "Mezcla", "Suplementos"),
  ], [sales("pulmon", 2), sales("other", 3), sales("mix", 4)]);
  const all = browseCatalog(listings, categories, {});
  assert.deepEqual(all.shelves.map((shelf) => shelf.category.label), ["Snacks deshidratados", "Suplementos"]);
  const filtered = browseCatalog(listings, categories, { query: "PULMON", categoryId: "Snacks deshidratados" });
  assert.deepEqual(filtered.shelves[0].products.map((item) => item.sku), ["other", "pulmon"]);
  assert.equal(browseCatalog(listings, categories, { query: "mix" }).shelves[0].products[0].sku, "mix");
  assert.equal(browseCatalog(listings, categories, { query: "missing" }).total, 0);
});
