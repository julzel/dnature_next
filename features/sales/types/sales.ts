import type { AvifyCategory, AvifyProduct } from "@/features/catalog/types/avify";

export type SalesOrderLine = { sku: string; customSku: string | null; name: string; ordered: number; price: number };
export type SalesOrder = {
  id: string;
  created: string;
  status: string;
  channel: string;
  currency: string;
  products: SalesOrderLine[];
};
export type SalesProduct = { sku: string; customSku: string | null; name: string; categories: AvifyCategory[] };
export type SalesBucket = {
  sku: string;
  date: string;
  channel: string;
  currency: string;
  units: number;
  orders: number;
  gross: number;
};
export type SalesDataset = {
  fromDate: string;
  today: string;
  fetchedAt: string;
  scannedOrders: number;
  eligibleOrders: number;
  unmatchedProducts: number;
  products: SalesProduct[];
  buckets: SalesBucket[];
};
export type SalesCatalog = readonly AvifyProduct[];
