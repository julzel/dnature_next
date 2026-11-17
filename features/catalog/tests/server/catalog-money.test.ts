import assert from "node:assert/strict";
import { test } from "node:test";
import { formatCatalogPrice } from "../../lib/catalog-money";

test("colón prices use a fixed separator in every runtime", () => {
  assert.equal(formatCatalogPrice(1900), "₡1 900");
  assert.equal(formatCatalogPrice(2100), "₡2 100");
  assert.equal(formatCatalogPrice(1000000), "₡1 000 000");
  assert.equal(formatCatalogPrice(1900.6), "₡1 901");
});
