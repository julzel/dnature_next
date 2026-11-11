import assert from "node:assert/strict";
import { test } from "node:test";
import { categoryFromSlug, categoryPath, filterCatalog, isCategorySlug, prepareCatalog, type CatalogFilters } from "../../lib/browse-catalog";
import { catalogFilterUrl, readCatalogFilters } from "../../lib/catalog-filter-url";
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

function filters(overrides: Partial<CatalogFilters> = {}): CatalogFilters {
  return { query: "", categoryIds: [], inStockOnly: false, sort: "relevance", ...overrides };
}

test("prepares catalog previews with images, availability, and active variant prices", () => {
  const parent = product("parent", "Pulmón", "Snacks deshidratados", 0);
  parent.commerce.children = [{ id: "v", sku: "v", name: "Pequeño", status: "active", price: 3000, salePrice: null, qty: 3 }];
  const { categories, listings } = prepareCatalog([parent, product("sold-out", "Agotado", "Snacks deshidratados", 0)]);
  assert.equal(categories.length, 1);
  assert.deepEqual(listings.map((item) => item.sku), ["parent", "sold-out"]);
  assert.equal(listings[0].offer.price, 3000);
  assert.equal(listings[0].imageUrl, "https://images.ctfassets.net/space/parent.jpg");
  assert.equal(listings[1].offer.inStock, false);
});

test("uses the five current category names and shared theme colors", () => {
  const names = ["Suplementos", "Órganos", "Complementos", "Recetas completas", "Snacks deshidratados"];
  const { categories } = prepareCatalog(names.map((name, index) => product(`item-${index}`, name, name)));
  assert.deepEqual(categories.map(({ label, color }) => [label, color]), [
    ["Deshidratados", "var(--dn-category-deshidratados)"],
    ["Recetas completas", "var(--dn-category-recetas-completas)"],
    ["Complementos", "var(--dn-category-complementos)"],
    ["Suplementos", "var(--dn-category-suplementos)"],
    ["Órganos", "var(--dn-category-organos)"],
  ]);
});

test("category links keep their readable paths and reject malformed category slugs", () => {
  const products = Array.from({ length: 7 }, (_, index) => product(`sku-${index}`, `Producto ${index}`, "Proteínas"));
  for (const item of products) item.commerce.categories[0].id = "42";
  const { categories } = prepareCatalog(products);
  assert.equal(categoryPath(categories[0]), "/productos/categoria/proteinas-42");
  assert.equal(categoryFromSlug(categories, "proteinas-42")?.id, "42");
  assert.equal(categoryFromSlug(categories, "unknown"), undefined);
  assert.equal(isCategorySlug("proteinas-42"), true);
  assert.equal(isCategorySlug("../../other"), false);
});

test("returns every matching product with available products first by default", () => {
  const entries = [product("sold-out", "A agotado", "Órganos", 0),
    ...Array.from({ length: 8 }, (_, index) => product(`p${index}`, `Producto ${index}`, "Órganos"))];
  const { categories, listings } = prepareCatalog(entries);
  const result = filterCatalog(listings, categories, filters());
  assert.equal(result.total, 9);
  assert.equal(result.products.at(-1)?.sku, "sold-out");
  assert.equal(result.availableCount, 8);
  assert.equal(result.categoryCounts["Órganos"], 9);
  assert.equal(filterCatalog(listings, categories, filters({ query: "   " })).total, 9);
});

test("searches accent-insensitive words in any order across names, ingredients, categories, and active variants", () => {
  const item = product("main-sku", "Receta de búfalo", "Recetas completas");
  item.commerce.name = "DNAture mezcla especial";
  item.editorial.fields.ingredientes = "Búfalo, hígado de res y cúrcuma.";
  item.editorial.fields.description = "Descripción secreta que no pertenece al índice";
  item.commerce.children = [
    { id: "v", sku: "VAR-500-G", name: "500g", status: "active", price: 3000, salePrice: 2800, qty: 3 },
    { id: "old", sku: "discontinued-sku", name: "Presentación retirada", status: "inactive", price: 1000, salePrice: null, qty: 3 },
  ];
  const { categories, listings } = prepareCatalog([item]);
  for (const query of ["CURCUMA bufalo", "500g higado", "COMPLETAS res", "var-500-g", "mezcla especial", "main-sku"]) {
    assert.equal(filterCatalog(listings, categories, filters({ query })).total, 1, query);
  }
  for (const query of ["discontinued-sku", "retirada", "secreta", "pollo"]) {
    assert.equal(filterCatalog(listings, categories, filters({ query })).total, 0, query);
  }
  assert.equal(listings[0].variants.length, 1);
  assert.deepEqual(listings[0].variants[0], { name: "500g", price: 2800, inStock: true });
  assert.ok(!JSON.stringify(listings).includes("Descripción secreta"));
});

test("prepares ingredient copy as plain text and uses the same fallback pricing as product offers", () => {
  const item = product("test", "Receta", "Recetas completas");
  item.editorial.fields.ingredientes = "<p>Hígado &amp; arroz</p> <script>tracking()</script> &lt;b&gt;Cúrcuma&lt;/b&gt;&#32;";
  item.commerce.children = [{ id: "v", sku: "v", name: "Grande", status: "active", price: null, salePrice: null, qty: 0 }];
  const { listings } = prepareCatalog([item]);
  assert.equal(listings[0].ingredients, "Hígado & arroz Cúrcuma");
  assert.deepEqual(listings[0].variants, [{ name: "Grande", price: 2500, inStock: false }]);
  assert.equal(listings[0].offer.inStock, false);
});

test("prioritizes exact SKU and names, then prefixes, before ingredient-only matches", () => {
  const exactSku = product("salmon", "Zeta", "Complementos");
  const exactName = product("exact-name", "Salmón", "Complementos", 0);
  const prefixName = product("prefix-name", "Salmón deshidratado", "Deshidratados");
  const ingredientOnly = product("ingredient-only", "Aceite", "Suplementos");
  ingredientOnly.editorial.fields.ingredientes = "Aceite de salmón";
  const { categories, listings } = prepareCatalog([ingredientOnly, prefixName, exactName, exactSku]);
  assert.deepEqual(filterCatalog(listings, categories, filters({ query: "SALMON" })).products.map(({ sku }) => sku),
    ["salmon", "exact-name", "prefix-name", "ingredient-only"]);
});

test("live search matches word beginnings and SKU prefixes without matching hidden fragments", () => {
  const beef = product("beef-id", "Carne de res", "Complementos");
  const strawberries = product("berry-id", "Fresas", "Complementos");
  const hiddenSku = product("abcd-dead-5678", "Aceite", "Suplementos");
  const recipe = product("recipe-id", "Pollo y res", "Recetas completas");
  recipe.editorial.fields.ingredientes = "Cúrcuma, pollo, res.";
  const { categories, listings } = prepareCatalog([beef, strawberries, hiddenSku, recipe]);
  assert.deepEqual(filterCatalog(listings, categories, filters({ query: "res" })).products.map(({ sku }) => sku), ["beef-id", "recipe-id"]);
  assert.equal(filterCatalog(listings, categories, filters({ query: "dead" })).total, 0);
  assert.equal(filterCatalog(listings, categories, filters({ query: "abcd-dead" })).products[0]?.sku, "abcd-dead-5678");
  assert.equal(filterCatalog(listings, categories, filters({ query: "curc, POLL" })).products[0]?.sku, "recipe-id");
});

test("human words remain searchable when a SKU happens to be the same word", () => {
  const item = product("salmon", "Salmón omega", "Complementos");
  const { categories, listings } = prepareCatalog([item]);
  assert.equal(filterCatalog(listings, categories, filters({ query: "salmon omega" })).total, 1);
});

test("short live queries prioritize product words over UUID prefixes while exact short SKUs still match", () => {
  const { categories, listings } = prepareCatalog([
    product("caba-uuid", "Aceite", "Suplementos"),
    product("caldo-sku", "Caldo de res", "Complementos"),
    product("cal-uuid", "Avena", "Suplementos"),
    product("c", "Exacto", "Suplementos"),
  ]);
  assert.deepEqual(filterCatalog(listings, categories, filters({ query: "c" })).products.map(({ sku }) => sku), ["c", "caldo-sku"]);
  assert.deepEqual(filterCatalog(listings, categories, filters({ query: "cal" })).products.map(({ sku }) => sku), ["caldo-sku", "cal-uuid"]);
});

test("category choices use OR, distinct facet counts ignore selected categories, stock counts ignore stock selection", () => {
  const shared = product("shared", "Hígado", "Complementos");
  shared.commerce.categories.push({ id: "Órganos", label: "Órganos", parentId: null });
  shared.commerce.categories.push({ id: "Órganos", label: "Órganos", parentId: null });
  const { categories, listings } = prepareCatalog([
    shared, product("organ", "Hígado de res", "Órganos", 0),
    product("other", "Hígado deshidratado", "Deshidratados"),
    product("excluded", "Pulmón", "Deshidratados"),
  ]);
  const selected = filters({ query: "higado", categoryIds: ["Complementos", "Órganos"] });
  const result = filterCatalog(listings, categories, selected);
  assert.equal(result.total, 2);
  assert.equal(result.availableCount, 1);
  assert.deepEqual(result.categoryCounts, { Complementos: 1, Deshidratados: 1, "Órganos": 2 });
  const available = filterCatalog(listings, categories, { ...selected, inStockOnly: true });
  assert.equal(available.total, 1);
  assert.equal(available.availableCount, 1);
  assert.deepEqual(available.categoryCounts, { Complementos: 1, Deshidratados: 1, "Órganos": 1 });
});

test("sorts all matches by price, keeps missing prices last in either direction, and breaks name ties by SKU", () => {
  const entries = [product("z", "Igual", "Complementos"), product("a", "Igual", "Complementos"), product("missing", "A sin precio", "Complementos")];
  entries[0].commerce.price = 3000;
  entries[1].commerce.price = 1000;
  entries[2].commerce.price = null;
  const { categories, listings } = prepareCatalog(entries);
  assert.deepEqual(filterCatalog(listings, categories, filters({ sort: "price-asc" })).products.map(({ sku }) => sku), ["a", "z", "missing"]);
  assert.deepEqual(filterCatalog(listings, categories, filters({ sort: "price-desc" })).products.map(({ sku }) => sku), ["z", "a", "missing"]);
  assert.deepEqual(filterCatalog(listings, categories, filters({ sort: "name" })).products.map(({ sku }) => sku), ["missing", "a", "z"]);
});

test("filter URLs use readable category slugs and round-trip the full selection without losing typing spaces", () => {
  const entries = [product("p", "Receta", "Recetas completas"), product("o", "Hígado", "Órganos")];
  entries[0].commerce.categories[0].id = "14528";
  entries[1].commerce.categories[0].id = "14527";
  const { categories } = prepareCatalog(entries);
  const selection = filters({ query: "búfalo ", categoryIds: ["14528", "14527", "14527", "unknown"], inStockOnly: true, sort: "price-asc" });
  const url = catalogFilterUrl(selection, categories);
  assert.equal(url, "/productos?q=b%C3%BAfalo+&categoria=recetas-completas&categoria=organos&disponible=1&orden=price-asc");
  const parsed = readCatalogFilters(new URL(url, "https://example.com").searchParams, categories);
  assert.deepEqual(parsed, { ...selection, categoryIds: ["14528", "14527"] });
  assert.equal(catalogFilterUrl(parsed, categories), url);
  assert.equal(catalogFilterUrl(filters(), categories), "/productos");
  assert.equal(readCatalogFilters(new URLSearchParams("q=+"), categories).query, " ");
});

test("URL parsing accepts old category IDs, handles invalid or repeated scalar parameters, and limits query size", () => {
  const entry = product("p", "Órgano", "Órganos");
  entry.commerce.categories[0].id = "14527";
  const { categories } = prepareCatalog([entry]);
  const legacy = readCatalogFilters(new URLSearchParams("categoria=14527&categoria=organos&categoria=unknown&q=a&q=b&orden=unknown&disponible=1&disponible=1"), categories);
  assert.deepEqual(legacy, filters({ categoryIds: ["14527"] }));
  assert.deepEqual(readCatalogFilters(new URLSearchParams(), categories, "14527"), filters({ categoryIds: ["14527"] }));
  assert.deepEqual(readCatalogFilters(new URLSearchParams("categoria=unknown"), categories, "14527"), filters());
  assert.equal(readCatalogFilters(new URLSearchParams({ q: "x".repeat(200) }), categories).query.length, 100);
  assert.equal(new URL(catalogFilterUrl(filters({ query: "x".repeat(200) }), categories), "https://example.com").searchParams.get("q")?.length, 100);
});
