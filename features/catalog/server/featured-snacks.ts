import "server-only";
import { selectFeaturedSnacks } from "../lib/featured-snacks";
import { getCatalogProducts } from "./catalog";
import { getRecentCatalogSales } from "./recent-sales";

export async function getFeaturedSnacks() {
  const [catalog, buckets] = await Promise.all([getCatalogProducts(), getRecentCatalogSales()]);
  return selectFeaturedSnacks(catalog, buckets);
}
