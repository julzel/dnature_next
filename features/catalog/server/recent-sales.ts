import "server-only";
import { cacheLife } from "next/cache";
import { getAvifyOrdersSince } from "@/features/sales/server/avify-orders";
import { localDate, summarizeSales } from "@/features/sales/lib/summarize-sales";

function thirtyDaysBefore(today: string): string {
  const timestamp = Date.parse(`${today}T00:00:00Z`) - 29 * 86_400_000;
  return new Date(timestamp).toISOString().slice(0, 10);
}

async function getRecentSalesBuckets(fromDate: string, today: string) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86_400 });
  const orders = await getAvifyOrdersSince(fromDate);
  return summarizeSales(orders, [], fromDate, today, new Date().toISOString()).buckets;
}

export function getRecentCatalogSales() {
  const today = localDate(new Date());
  return getRecentSalesBuckets(thirtyDaysBefore(today), today);
}
