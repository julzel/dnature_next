import assert from "node:assert/strict";
import { test } from "node:test";
import { selectFeaturedSnacks } from "../../lib/featured-snacks";
import type { CatalogProduct } from "../../types/catalog";
import type { SalesBucket } from "@/features/sales/types/sales";

function product(sku: string, options: { qty?: number; price?: number; category?: string; image?: boolean } = {}): CatalogProduct {
  const { qty = 4, price = 2500, category = "Snacks deshidratados", image = true } = options;
  return {
    sku,
    commerce: {
      id: sku, sku, name: `Avify ${sku}`, status: "inactive", price, salePrice: null, qty,
      slug: sku, type: "simple", description: null,
      categories: [{ id: "1", label: category, parentId: null }], children: [],
    },
    editorial: {
      id: `entry-${sku}`,
      fields: { avifySku: sku, productName: `Editorial ${sku}` },
      images: image ? [{
        sys: { id: `image-${sku}`, type: "Asset" },
        fields: { file: { url: `//images.ctfassets.net/space/${sku}.jpg`, fileName: `${sku}.jpg`, contentType: "image/jpeg" } },
      }] : [],
    },
  };
}

function sales(sku: string, units: number): SalesBucket {
  return { sku, units, orders: 1, gross: units * 2500, date: "2026-11-07", channel: "web", currency: "CRC" };
}

test("shows four highest-selling stocked snacks and replaces out-of-stock leaders", () => {
  const catalog = [
    product("sold-out", { qty: 0 }),
    product("a"), product("b"), product("c"), product("d"), product("e"),
    product("wrong-category", { category: "Proteinas" }),
    product("no-image", { image: false }),
  ];
  const buckets = [sales("sold-out", 100), sales("a", 90), sales("b", 80), sales("c", 70), sales("d", 60), sales("e", 50), sales("wrong-category", 200), sales("no-image", 150)];
  assert.deepEqual(selectFeaturedSnacks(catalog, buckets).map((snack) => snack.sku), ["a", "b", "c", "d"]);
});

test("adds variant sales to the parent and uses the cheapest stocked active variant", () => {
  const configurable = product("parent", { qty: 0, price: 1000 });
  configurable.commerce.children = [
    { id: "v1", sku: "v1", name: "Small", status: "active", qty: 0, price: 900, salePrice: null },
    { id: "v2", sku: "v2", name: "Medium", status: "active", qty: 3, price: 1800, salePrice: 1500 },
    { id: "v3", sku: "v3", name: "Large", status: "active", qty: 2, price: 2200, salePrice: null },
  ];
  const featured = selectFeaturedSnacks([configurable, product("other")], [sales("parent", 2), sales("v2", 8), sales("other", 9)]);
  assert.equal(featured[0].sku, "parent");
  assert.equal(featured[0].unitsSold, 10);
  assert.equal(featured[0].price, 1500);
  assert.equal(featured[0].fromPrice, true);
  assert.equal(featured[0].imageUrl, "https://images.ctfassets.net/space/parent.jpg");
});

test("excludes unavailable variants, invalid prices, and unsafe image hosts", () => {
  const inactive = product("inactive", { qty: 0 });
  inactive.commerce.children = [{ id: "v", sku: "v", name: "Variant", status: "inactive", qty: 4, price: 1000, salePrice: null }];
  const invalidImage = product("image");
  invalidImage.editorial.images[0].fields.file!.url = "https://other.example/image.jpg";
  assert.deepEqual(selectFeaturedSnacks([inactive, product("free", { price: 0 }), invalidImage], [sales("v", 5), sales("free", 4), sales("image", 3)]), []);
});
