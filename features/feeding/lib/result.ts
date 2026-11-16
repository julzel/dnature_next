export type FeedingLine = { sku: string; name: string; presentation: string; href: string; quantity: number; price: number; role: string; note: string };
export type FeedingPackage = { id: string; name: string; ready: boolean; mixDailyGrams: number; complementDailyGrams: number; lines: FeedingLine[]; subtotal: number; iva: number; total: number; issues: string[]; notes: string[] };
export type FeedingResult = { id: string; name: string; review: string | null; rawDailyGrams: number | null; dailyGrams: number | null; meals: number | null; packages: FeedingPackage[] };
export type QuoteResponse = { version: string; days: number; calculatedAt: string; pets: FeedingResult[] };
